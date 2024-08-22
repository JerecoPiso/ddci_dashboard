import ReactPanZoom from "./index";
interface ImageViewerProps {
    image_path?: string;
    filename?: string;
}

export function ImageViewerContent({
    image_path = "",
    filename = "",
}: ImageViewerProps) {
    return (
        <div className="relative w-full h-full overflow-clip">
            <ReactPanZoom alt={filename ?? ""} image={image_path ?? ""} />
        </div>
    );
}