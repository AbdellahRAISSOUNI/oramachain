// Add support for className in framer-motion components
import { 
  HTMLMotionProps as OriginalHTMLMotionProps, 
  ForwardRefComponent 
} from 'framer-motion';

declare module 'framer-motion' {
  export interface MotionProps {
    className?: string;
    onClick?: () => void;
  }
} 