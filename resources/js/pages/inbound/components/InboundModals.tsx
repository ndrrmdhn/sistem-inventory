import type { ModalState, ModalWithData } from '@/hooks/useGenericModals';
import type { InboundTransaction } from '@/types/models/inbound';
import { InboundFormModal } from './InboundFormModal';
import { InboundShowModal } from './InboundShowModal';

interface InboundModalsProps {
    modals: ModalState<InboundTransaction>;
    onCloseModal: (type: string) => void;
    warehouses: Array<{ id: number; name: string }>;
    suppliers: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
}

export function InboundModals({
    modals,
    onCloseModal,
    warehouses,
    suppliers,
    products,
}: InboundModalsProps) {
    return (
        <>
            <InboundFormModal
                open={typeof modals.create === 'boolean' ? modals.create : modals.create.isOpen}
                onClose={() => onCloseModal('create')}
                warehouses={warehouses}
                suppliers={suppliers}
                products={products}
            />

            <InboundShowModal
                open={(modals.show as ModalWithData<InboundTransaction>).isOpen}
                inbound={(modals.show as ModalWithData<InboundTransaction>).data}
                onClose={() => onCloseModal('show')}
            />
        </>
    );
}