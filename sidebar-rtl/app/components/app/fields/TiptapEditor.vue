<script setup lang="ts">
import type { MediaType } from '~/types/media'
import { EditorContent as TiptapEditorContent, useEditor } from '@tiptap/vue-3'
import { onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import MediaSelect from '~/components/app/medias/MediaSelect.vue'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import {
  TiptapImage,
  TiptapLink,
  TiptapStarter,
  TiptapSubscript,
  TiptapSuperscript,
  TiptapTaskItem,
  TiptapTaskList,
  TiptapTextAlign,
} from '~/composables/tiptapExt'

const value = defineModel<string>({ required: true, default: '' })

const isFullscreen = ref(false)
const selectedMedias = ref<MediaType[]>([])
const headingsOpen = ref(false)
const listsOpen = ref(false)
const linkPopoverOpen = ref(false)
const linkUrl = ref('')

const editor = useEditor({
  content: value.value,
  extensions: [
    TiptapStarter,
    TiptapImage.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md',
      },
    }),
    TiptapTaskList,
    TiptapTaskItem,
    TiptapTextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TiptapLink.configure({
      openOnClick: false,
    }),
    TiptapSuperscript,
    TiptapSubscript,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    value.value = editor.getHTML()
  },
})

function selectList(type: 'bullet' | 'ordered' | 'task') {
  if (!editor.value)
    return
  if (type === 'bullet') {
    editor.value.chain().focus().toggleBulletList().run()
  }
  else if (type === 'ordered') {
    editor.value.chain().focus().toggleOrderedList().run()
  }
  else if (type === 'task') {
    editor.value.chain().focus().toggleTaskList().run()
  }
  listsOpen.value = false
}

function selectHeading(type: 'paragraph' | number) {
  if (!editor.value)
    return
  if (type === 'paragraph') {
    editor.value.chain().focus().setParagraph().run()
  }
  else {
    editor.value.chain().focus().toggleHeading({ level: type as any }).run()
  }
  headingsOpen.value = false
}

// Link functionality
watch(linkPopoverOpen, (isOpen) => {
  if (isOpen && editor.value) {
    // Get current link if selection is within a link
    const { href } = editor.value.getAttributes('link')
    linkUrl.value = href || ''
  }
})

function setLink() {
  if (!editor.value || !linkUrl.value.trim())
    return

  // Add protocol if missing
  let url = linkUrl.value.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
    url = `https://${url}`
  }

  // Check if there's a selection or if we're in a link
  const { from, to } = editor.value.state.selection
  const hasSelection = from !== to

  if (hasSelection || editor.value.isActive('link')) {
    // Apply link to selection or update existing link
    editor.value
      .chain()
      .focus()
      .setLink({ href: url })
      .run()
  }
  else {
    // No selection, insert link text
    editor.value
      .chain()
      .focus()
      .insertContent(`<a href="${url}">${linkUrl.value}</a>`)
      .run()
  }

  linkPopoverOpen.value = false
  linkUrl.value = ''
}

function removeLink() {
  if (!editor.value)
    return

  editor.value.chain().focus().unsetLink().run()
  linkPopoverOpen.value = false
  linkUrl.value = ''
}
// Handle media selection
function handleMediaSelection(medias: MediaType[]) {
  console.warn('Media selection received:', medias)

  if (medias.length > 0 && editor.value) {
    const media = medias[0]

    if (!media) {
      console.warn('No media found')
      return
    }

    console.warn('Processing media:', media)

    if (media.file_type === 'PHOTO' && media.media_url) {
      console.warn('Inserting image:', media.media_url)
      // Insert image
      editor.value
        .chain()
        .focus()
        .setImage({
          src: media.media_url,
          alt: media.caption || 'Selected image',
          title: media.caption || 'Selected image',
        })
        .run()
    }
    else if (media.file_type === 'VIDEO' && media.media_url) {
      console.warn('Inserting video:', media.media_url)
      // Insert video as HTML
      const videoHtml = `
        <video controls class="max-w-full h-auto rounded-lg border shadow-sm my-4">
          <source src="${media.media_url}" type="video/mp4">
          <source src="${media.media_url}" type="video/webm">
          <source src="${media.media_url}" type="video/avi">
          Your browser does not support the video tag.
        </video>
      `
      editor.value
        .chain()
        .focus()
        .insertContent(videoHtml)
        .run()
    }
    else {
      console.warn('Media type not supported or missing URL:', media.file_type, media.media_url)
    }
  }
  else {
    console.warn('No medias or editor not available')
  }

  // Reset selection after insertion
  selectedMedias.value = []
}

// Fullscreen functionality
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  }
  else {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }
}

function closeFullscreen() {
  isFullscreen.value = false
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

// Handle escape key for fullscreen
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isFullscreen.value) {
    closeFullscreen()
  }
}

// Watch for external content changes
watch(value, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  unref(editor)?.destroy()
})
</script>

<template>
  <div
    class="bg-card border rounded-lg overflow-hidden shadow-sm"
    :class="{ 'fixed inset-0 z-50 !rounded-none !border-0 shadow-2xl': isFullscreen }"
  >
    <!-- Toolbar -->
    <div class="border-b bg-accent/20 p-3 font-sans">
      <TooltipProvider>
        <div class="flex flex-wrap items-center">
          <!-- Text Formatting -->
          <div class="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('bold') ? 'default' : 'ghost'"
                  :disabled="!editor?.can().chain().focus().toggleBold().run()"

                  @click="editor?.chain().focus().toggleBold().run()"
                >
                  <span class="icon-[lucide--bold] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bold (Ctrl+B)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('italic') ? 'default' : 'ghost'"
                  :disabled="!editor?.can().chain().focus().toggleItalic().run()"

                  @click="editor?.chain().focus().toggleItalic().run()"
                >
                  <span class="icon-[lucide--italic] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Italic (Ctrl+I)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('strike') ? 'default' : 'ghost'"
                  :disabled="!editor?.can().chain().focus().toggleStrike().run()"

                  @click="editor?.chain().focus().toggleStrike().run()"
                >
                  <span class="icon-[lucide--strikethrough] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Strikethrough</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('code') ? 'default' : 'ghost'"
                  :disabled="!editor?.can().chain().focus().toggleCode().run()"

                  @click="editor?.chain().focus().toggleCode().run()"
                >
                  <span class="icon-[lucide--code] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Inline Code</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <!-- Headings Dropdown -->
          <div class="flex items-center gap-1 mr-1.5 border-r border-border pr-1.5 ">
            <DropdownMenu v-model:open="headingsOpen">
              <DropdownMenuTrigger as-child>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button size="icon" class="size-8" variant="ghost" @click="headingsOpen = !headingsOpen">
                      <span class="icon-[lucide--heading] size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Headings</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Headings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="selectHeading('paragraph')">
                  <span :class="editor?.isActive('paragraph') ? ' text-primary' : ''">
                    Paragraph
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="selectHeading(1)">
                  <span :class="editor?.isActive('heading', { level: 1 }) ? ' text-primary' : ''">
                    Heading 1
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="selectHeading(2)">
                  <span :class="editor?.isActive('heading', { level: 2 }) ? ' text-primary' : ''">
                    Heading 2
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="selectHeading(3)">
                  <span :class="editor?.isActive('heading', { level: 3 }) ? ' text-primary' : ''">
                    Heading 3
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="selectHeading(4)">
                  <span :class="editor?.isActive('heading', { level: 4 }) ? ' text-primary' : ''">
                    Heading 4
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <!-- Lists Dropdown -->
          <div class="flex items-center gap-1 mr-1.5 border-r border-border pr-1.5">
            <DropdownMenu v-model:open="listsOpen">
              <DropdownMenuTrigger as-child>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button size="icon" class="size-8" variant="ghost" @click="listsOpen = !listsOpen">
                      <span class="icon-[lucide--list] size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lists</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Lists</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="selectList('bullet')">
                  <span :class="editor?.isActive('bulletList') ? 'font-bold text-primary' : ''">
                    Bullet List
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="selectList('ordered')">
                  <span :class="editor?.isActive('orderedList') ? 'font-bold text-primary' : ''">
                    Numbered List
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="selectList('task')">
                  <span :class="editor?.isActive('taskList') ? 'font-bold text-primary' : ''">
                    Task List
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <!-- Blocks -->
          <div class="flex items-center gap-1 mr-1.5 border-r border-border pr-1.5">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('blockquote') ? 'default' : 'ghost'"

                  @click="editor?.chain().focus().toggleBlockquote().run()"
                >
                  <span class="icon-[lucide--quote] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quote</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('codeBlock') ? 'default' : 'ghost'"

                  @click="editor?.chain().focus().toggleCodeBlock().run()"
                >
                  <span class="icon-[lucide--code-2] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Code Block</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  variant="ghost"

                  @click="editor?.chain().focus().setHorizontalRule().run()"
                >
                  <span class="icon-[lucide--minus] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Horizontal Rule</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <!-- Alignment -->
          <div class="flex items-center gap-1 mr-1.5 border-r border-border pr-1.5">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'"
                  @click="editor?.chain().focus().setTextAlign('right').run()"
                >
                  <span class="icon-[lucide--align-right] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Right</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'"
                  @click="editor?.chain().focus().setTextAlign('center').run()"
                >
                  <span class="icon-[lucide--align-center] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Center</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'"
                  @click="editor?.chain().focus().setTextAlign('left').run()"
                >
                  <span class="icon-[lucide--align-left] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Left</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'"
                  @click="editor?.chain().focus().setTextAlign('justify').run()"
                >
                  <span class="icon-[lucide--align-justify] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Justify</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <!-- Superscript/Subscript -->
          <div class="flex items-center gap-1 mr-1.5 border-r border-border pr-1.5">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('superscript') ? 'default' : 'ghost'"
                  @click="editor?.chain().focus().toggleSuperscript().run()"
                >
                  <span class="icon-[lucide--superscript] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Superscript</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('subscript') ? 'default' : 'ghost'"
                  @click="editor?.chain().focus().toggleSubscript().run()"
                >
                  <span class="icon-[lucide--subscript] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Subscript</p>
              </TooltipContent>
            </Tooltip>

            <Popover v-model:open="linkPopoverOpen">
              <PopoverTrigger as-child>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button
                      size="icon"
                      class="size-8" :variant="editor?.isActive('link') ? 'default' : 'ghost'"
                      @click="linkPopoverOpen = !linkPopoverOpen"
                    >
                      <span class="icon-[lucide--link] size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Link</p>
                  </TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent class="w-80">
                <div class="space-y-3">
                  <div class="space-y-2">
                    <h4 class="font-medium text-sm">
                      اضافه کردن لینک
                    </h4>
                    <InputSecondary
                      v-model="linkUrl"
                      label="آدرس لینک"
                      placeholder="https://example.com"
                      class="w-full"
                      dir="ltr"
                      @keydown.enter="setLink"
                    />
                  </div>
                  <div class="flex justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      :disabled="!editor?.isActive('link')"
                      @click="removeLink"
                    >
                      حذف
                    </Button>
                    <Button
                      size="sm"
                      :disabled="!linkUrl.trim()"
                      @click="setLink"
                    >
                      ثبت
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <!-- Media -->
          <div class="flex items-center gap-1 mr-1.5 border-r border-border pr-1.5">
            <MediaSelect
              v-model="selectedMedias"
              :multiple="false"
              :immediate="true"
              :types="['PHOTO', 'VIDEO']"
              @update:model-value="handleMediaSelection"
            >
              <button
                class="flex items-center gap-2 font-vazir text-xs cursor-pointer py-1 px-2.5 rounded-md
               hover:bg-secondary border border-transparent hover:border-border"
              >
                <span class="icon-[material-symbols-light--add-photo-alternate-outline] size-5" />
                رسانه
              </button>
            </MediaSelect>
          </div>

          <!-- Undo/Redo -->
          <div class="flex items-center gap-1 mr-1.5 border-r border-border pr-1.5">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  variant="ghost"
                  :disabled="!editor?.can().chain().focus().undo().run()"

                  @click="editor?.chain().focus().undo().run()"
                >
                  <span class="icon-[solar--undo-right-round-outline] size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  variant="ghost"
                  :disabled="!editor?.can().chain().focus().redo().run()"

                  @click="editor?.chain().focus().redo().run()"
                >
                  <span class="icon-[solar--undo-left-round-outline] size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <!-- Fullscreen Toggle -->
          <div class="flex items-center gap-1 ml-auto">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="isFullscreen ? 'default' : 'ghost'"

                  @click="toggleFullscreen"
                >
                  <span :class="isFullscreen ? 'icon-[lucide--minimize]' : 'icon-[lucide--maximize]'" class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen' }}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>

    <!-- Editor Content -->
    <div
      class="editor-content-wrapper font-vazir relative z-50 "
      :class="{ 'flex-1 flex flex-col': isFullscreen }"
    >
      <TiptapEditorContent
        :editor="editor"
        class="prose dark:prose-invert max-w-none [&>div]:sm:!max-w-none [&>div]:min-h-[400px] [&>div]:p-6 focus:outline-none prose-img:mx-auto prose-a:text-primary" :class="[
          isFullscreen
            ? 'flex-1  overflow-y-auto z-50'
            : 'min-h-[400px] ',
        ]"

      />
    </div>
  </div>
</template>
