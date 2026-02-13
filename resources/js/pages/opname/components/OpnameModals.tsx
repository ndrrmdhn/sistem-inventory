import type { ModalState, ModalWithData } from '@/hooks/useGenericModals';
import type { Opname } from '@/types/models/opname';
import { OpnameApproveModal } from './OpnameApproveModal';
import { OpnameFormModal } from './OpnameFormModal';
import { OpnameShowModal } from './OpnameShowModal';

interface OpnameModalsProps {
    modals: ModalState<Opname>;
    onCloseModal: (type: string) => void;
    warehouses: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
    stocks: Array<{
        id: number;
        warehouse_id: number;
        product_id: number;
        quantity: number;
        product: { id: number; name: string };
        warehouse: { id: number; name: string };
    }>;
}

export function OpnameModals({
    modals,
    onCloseModal,
    warehouses,
    products,
    stocks,
}: OpnameModalsProps) {
    return (
        <>
            <OpnameFormModal
                open={typeof modals.create === 'boolean' ? modals.create : modals.create.isOpen}
                onClose={() => onCloseModal('create')}
                warehouses={warehouses}
                products={products}
                stocks={stocks}
            />

            <OpnameShowModal
                open={(modals.show as ModalWithData<Opname>).isOpen}
                opname={(modals.show as ModalWithData<Opname>).data}
                onClose={() => onCloseModal('show')}
            />

            <OpnameApproveModal
                open={(modals.approve as ModalWithData<Opname>).isOpen}
                opname={(modals.approve as ModalWithData<Opname>).data}
                onClose={() => onCloseModal('approve')}
            />
        </>
    );
}
