import type { ModalState, ModalWithData } from '@/hooks/useGenericModals';
import type { OutboundTransaction } from '@/types/models/outbound';
import { OutboundFormModal } from './OutboundFormModal';
import { OutboundShowModal } from './OutboundShowModal';

interface OutboundModalsProps {
    modals: ModalState<OutboundTransaction>;
    onCloseModal: (type: string) => void;
    warehouses: Array<{ id: number; name: string }>;
    customers: Array<{ id: number; name: string }>;
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

export function OutboundModals({
    modals,
    onCloseModal,
    warehouses,
    customers,
    products,
    stocks,
}: OutboundModalsProps) {
    return (
        <>
            <OutboundFormModal
                open={typeof modals.create === 'boolean' ? modals.create : modals.create.isOpen}
                onClose={() => onCloseModal('create')}
                warehouses={warehouses}
                customers={customers}
                products={products}
                stocks={stocks}
            />

            <OutboundShowModal
                open={(modals.show as ModalWithData<OutboundTransaction>).isOpen}
                outbound={(modals.show as ModalWithData<OutboundTransaction>).data}
                onClose={() => onCloseModal('show')}
            />
        </>
    );
}
