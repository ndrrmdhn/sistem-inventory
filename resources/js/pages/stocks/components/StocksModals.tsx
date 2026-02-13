import { StocksShowModal } from './StocksShowModal';
import type { StocksModalsProps } from '@/types/models/stocks';

export function StocksModals({
    showModal,
    selectedStock,
    onCloseShowModal,
}: StocksModalsProps) {
    return (
        <>
            <StocksShowModal
                stock={selectedStock}
                isOpen={showModal}
                onClose={onCloseShowModal}
            />
        </>
    );
}