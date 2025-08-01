import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs min-w-20 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/80  shadow',
        white: 'bg-radial-[at_52%_-52%] **:[text-shadow:0_1px_0_var(--color-white)] border-white from-white/70 to-white/95 text-black inset-shadow-2xs inset-shadow-white/25 dark:inset-shadow-white dark:from-white dark:to-white/70 dark:hover:to-white border text-sm shadow-md shadow-zinc-950/30 ring-0 transition-[filter] duration-200 hover:brightness-125 active:brightness-95 dark:border-0',
        outline:
          'border hover:bg-secondary',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-secondary border border-transparent hover:border-border hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        info: 'bg-info hover:bg-info/90 text-white dark:bg-info/15 dark:text-info-lighter shadow dark:hover:bg-info/20',
        success:
          'bg-success hover:bg-success/90 text-black shadow',
        alert:
          'bg-alert hover:bg-alert/80 text-black shadow',
        warning:
          'bg-warning hover:bg-warning/80 text-black shadow',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9 ',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
