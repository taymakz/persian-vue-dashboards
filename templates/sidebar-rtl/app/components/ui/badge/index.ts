import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary hover:bg-primary/90 text-primary-foreground border-transparent',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'text-foreground bg-card',

        info: 'bg-info text-black hover:bg-info/80',

        success:
          'bg-success text-black hover:bg-success/80',

        alert:
          'bg-alert text-black hover:bg-alert/80',

        warning:
          'bg-warning text-black hover:bg-warning/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
