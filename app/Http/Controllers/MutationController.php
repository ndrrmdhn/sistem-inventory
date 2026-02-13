<?php

namespace App\Http\Controllers;

use App\Actions\Transaction\CreateMutationAction;
use App\Http\Requests\Transaction\ReceiveMutationRequest;
use App\Http\Requests\Transaction\StoreMutationRequest;
use App\Models\Product;
use App\Models\StockMutation;
use App\Models\Warehouse;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class MutationController extends Controller
{
    public function __construct(
        private readonly CreateMutationAction $createMutationAction,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', StockMutation::class);

        $user = auth()->user();
        $isSuperAdmin = $user->hasRole('super-admin');

        // Get all mutations (both outgoing and incoming for the user)
        $query = StockMutation::with(['fromWarehouse', 'toWarehouse', 'product', 'creator']);

        if (! $isSuperAdmin) {
            $userWarehouseIds = $user->warehouses()->pluck('warehouses.id')->toArray();
            $query->where(function ($q) use ($userWarehouseIds) {
                $q->whereIn('from_warehouse', $userWarehouseIds)
                    ->orWhereIn('to_warehouse', $userWarehouseIds);
            });
        }

        // Apply filters
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                    ->orWhereHas('product', fn ($subQ) => $subQ->where('name', 'like', "%{$request->search}%"))
                    ->orWhereHas('fromWarehouse', fn ($subQ) => $subQ->where('name', 'like', "%{$request->search}%"))
                    ->orWhereHas('toWarehouse', fn ($subQ) => $subQ->where('name', 'like', "%{$request->search}%"));
            });
        }

        if ($request->status) {
            // Convert frontend status to database status
            $dbStatus = StockMutation::STATUS_REVERSE_MAPPING[$request->status] ?? $request->status;
            $query->where('status', $dbStatus);
        }

        if ($request->type) {
            if ($request->type === 'outgoing') {
                if (! $isSuperAdmin) {
                    $userWarehouseIds = $user->warehouses()->pluck('warehouses.id')->toArray();
                    $query->whereIn('from_warehouse', $userWarehouseIds);
                }
                // For super admin, no additional filter - show all mutations
            } elseif ($request->type === 'incoming') {
                if (! $isSuperAdmin) {
                    $userWarehouseIds = $user->warehouses()->pluck('warehouses.id')->toArray();
                    $query->whereIn('to_warehouse', $userWarehouseIds);
                }
                // For super admin, no additional filter - show all mutations
            }
        }

        $mutations = $query->latest()->paginate(15);

        // Add type to each mutation
        $mutations->getCollection()->transform(function ($mutation) use ($user, $isSuperAdmin, $request) {
            if ($isSuperAdmin) {
                // For super admin, determine type based on filter or default logic
                if ($request->type === 'outgoing') {
                    $mutation->type = 'outgoing';
                } elseif ($request->type === 'incoming') {
                    $mutation->type = 'incoming';
                } else {
                    // Default: determine based on user's warehouses if they have any, otherwise show actual direction
                    $userWarehouseIds = $user->warehouses()->pluck('warehouses.id')->toArray();
                    if (! empty($userWarehouseIds)) {
                        $mutation->type = in_array($mutation->from_warehouse, $userWarehouseIds) ? 'outgoing' : 'incoming';
                    } else {
                        // For super-admin with no specific warehouses, alternate between outgoing and incoming
                        // to show variety in the UI (this is just for display purposes)
                        $mutation->type = $mutation->id % 2 === 0 ? 'outgoing' : 'incoming';
                    }
                }
            } else {
                $userWarehouseIds = $user->warehouses()->pluck('warehouses.id')->toArray();
                $mutation->type = in_array($mutation->from_warehouse, $userWarehouseIds) ? 'outgoing' : 'incoming';
            }

            return $mutation;
        });

        return Inertia::render('mutation/index', [
            'mutations' => $mutations,
            'warehouses' => $user->hasRole('super-admin')
                ? Warehouse::active()->get(['id', 'name'])
                : $user->warehouses()->active()->select('warehouses.id', 'warehouses.name')->get(),
            'products' => Product::active()->get(['id', 'name']),
            'stocks' => \App\Models\Stock::with(['product', 'warehouse'])
                ->whereHas('warehouse', function ($q) use ($user, $isSuperAdmin) {
                    if ($isSuperAdmin) {
                        $q->active();
                    } else {
                        $q->whereIn('id', $user->warehouses()->pluck('warehouses.id'));
                    }
                })
                ->where('quantity', '>', 0) // Only products with stock for mutations
                ->get(),
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function show(StockMutation $mutation): Response
    {
        $this->authorize('view', $mutation);

        return Inertia::render('mutation/show', [
            'mutation' => $mutation->load(['fromWarehouse', 'toWarehouse', 'product', 'creator', 'receiver']),
        ]);
    }

    public function store(StoreMutationRequest $request): RedirectResponse
    {
        $this->authorize('create', StockMutation::class);

        $validated = $request->validated();

        try {
            $this->createMutationAction->send(
                fromWarehouseId: $validated['from_warehouse'],
                toWarehouseId: $validated['to_warehouse'],
                productId: $validated['product_id'],
                quantity: $validated['quantity'],
                notes: $validated['notes'] ?? null,
            );

            return redirect()->route('mutations.index')
                ->with('success', 'Mutation berhasil dikirim.');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        }
    }

    public function receive(ReceiveMutationRequest $request, StockMutation $mutation): RedirectResponse
    {
        $this->authorize('receive', $mutation);

        $validated = $request->validated();

        try {
            $this->createMutationAction->receive(
                mutationId: $mutation->id,
                receivedQty: $validated['received_qty'],
                damagedQty: $validated['damaged_qty'] ?? 0,
            );

            return redirect()->route('mutations.index')
                ->with('success', 'Mutation berhasil diterima.');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors());
        }
    }

    public function reject(Request $request, StockMutation $mutation): RedirectResponse
    {
        $this->authorize('reject', $mutation);

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            $mutation->update([
                'status' => 'rejected',
                'rejected_at' => now(),
                'rejected_by' => auth()->id(),
                'notes' => $request->notes,
            ]);

            return redirect()->route('mutations.index')
                ->with('success', 'Mutation berhasil ditolak.');
        } catch (Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Gagal menolak mutation: '.$e->getMessage()]);
        }
    }
}
