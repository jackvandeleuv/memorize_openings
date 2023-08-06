import { useDragLayer } from 'react-dnd';
import Piece from './Piece';
import { ClickLoc } from './ChessBoard';

interface CellSize {
  width: number;
  height: number;
}

interface CustomDragProps {
    clickLoc: ClickLoc;
    cellSize: CellSize;
}

function CustomDragLayer(props: CustomDragProps) {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging) {
    return null;
  }

  function getLayerStyles() {
    if (!initialOffset || !currentOffset) {
        return {};
    }

    console.log(currentOffset.x, currentOffset.y)

    const x = currentOffset.x + props.clickLoc.x - props.cellSize.width / 2;
    const y = currentOffset.y + props.clickLoc.y - props.cellSize.height / 2;


    return {
        pointerEvents: 'none',
        transform: `translate(${x}px, ${y}px)`,
        WebkitTransform: `translate(${x}px, ${y}px)`,
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: 9999,
    } as React.CSSProperties;
  }

  return (
    <div style={{...getLayerStyles(), width: `${props.cellSize.width}px`, height: `${props.cellSize.height}px`}}>
    <Piece 
        piece={item.piece}
        color={item.color}
        isDragging={isDragging}
        isDragPreview={true}
      />
    </div>
  );
}

export default CustomDragLayer;
