import { MutationCreateModal } from './MutationCreateModal';
import { MutationReceiveModal } from './MutationReceiveModal';
import { MutationRejectModal } from './MutationRejectModal';
import { MutationShowModal } from './MutationShowModal';
import type { MutationModalsProps } from '@/types/models/mutation';

interface MutationModalsPropsExtended extends MutationModalsProps {
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

export function MutationModals({
    showModal,
    selectedMutation,
    onCloseShowModal,
    createModal,
    onCloseCreateModal,
    receiveModal,
    onCloseReceiveModal,
    rejectModal,
    onCloseRejectModal,
    warehouses,
    products,
    stocks,
}: MutationModalsPropsExtended) {
    return (
        <>
            <MutationCreateModal
                open={createModal}
                onClose={onCloseCreateModal}
                warehouses={warehouses}
                products={products}
                stocks={stocks}
            />
            <MutationShowModal
                mutation={showModal.data}
                isOpen={showModal.isOpen}
                onClose={onCloseShowModal}
            />
            <MutationReceiveModal
                open={receiveModal.isOpen}
                mutation={receiveModal.data}
                onClose={onCloseReceiveModal}
            />
            <MutationRejectModal
                open={rejectModal.isOpen}
                mutation={rejectModal.data}
                onClose={onCloseRejectModal}
            />
        </>
    );
}
