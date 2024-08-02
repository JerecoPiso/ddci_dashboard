import { Loader } from "lucide-react";
type LoadingProps = {
    size: number
}
function Loading({size} : LoadingProps) {
  return <Loader className="animate-spin" size={size} />;
}
export default Loading;
