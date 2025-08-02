<script setup lang="ts">
import type { MediaType } from '~/types/media'
import { EditorContent as TiptapEditorContent, useEditor } from '@tiptap/vue-3'
import { onBeforeUnmount, ref, unref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import MediaSelect from '~/components/app/medias/MediaSelect.vue'
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
})

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
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = 'auto'
  }
}

function closeFullscreen() {
  isFullscreen.value = false
  document.body.style.overflow = 'auto'
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
  document.body.style.overflow = 'auto'
  unref(editor)?.destroy()
})
</script>

<template>
  <div
    class="bg-card border rounded-lg overflow-hidden shadow-sm"
    :class="{ 'fixed inset-0 z-50 !rounded-none !border-0 shadow-2xl': isFullscreen }"
  >
    <!-- Toolbar -->
    <div class="border-b bg-muted/30 p-3">
      <TooltipProvider>
        <div class="flex flex-wrap items-center gap-1">
          <!-- Text Formatting -->
          <div class="flex items-center gap-1 mr-3 border-r border-border pr-3">
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
          <div class="flex items-center gap-1 mr-3 border-r border-border pr-3">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button size="icon" class="size-8" variant="ghost">
                  <span class="icon-[lucide--heading] size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Headings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="editor?.chain().focus().setParagraph().run()">
                  <span :class="editor?.isActive('paragraph') ? 'font-bold text-primary' : ''">
                    Paragraph
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()">
                  <span :class="editor?.isActive('heading', { level: 1 }) ? 'font-bold text-primary' : ''">
                    Heading 1
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
                  <span :class="editor?.isActive('heading', { level: 2 }) ? 'font-bold text-primary' : ''">
                    Heading 2
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">
                  <span :class="editor?.isActive('heading', { level: 3 }) ? 'font-bold text-primary' : ''">
                    Heading 3
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()">
                  <span :class="editor?.isActive('heading', { level: 4 }) ? 'font-bold text-primary' : ''">
                    Heading 4
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <!-- Lists Dropdown -->
          <div class="flex items-center gap-1 mr-3 border-r border-border pr-3">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button size="icon" class="size-8" variant="ghost">
                  <span class="icon-[lucide--list] size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Lists</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="editor?.chain().focus().toggleBulletList().run()">
                  <span :class="editor?.isActive('bulletList') ? 'font-bold text-primary' : ''">
                    Bullet List
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="editor?.chain().focus().toggleOrderedList().run()">
                  <span :class="editor?.isActive('orderedList') ? 'font-bold text-primary' : ''">
                    Numbered List
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="editor?.chain().focus().toggleTaskList().run()">
                  <span :class="editor?.isActive('taskList') ? 'font-bold text-primary' : ''">
                    Task List
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <!-- Blocks -->
          <div class="flex items-center gap-1 mr-3 border-r border-border pr-3">
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
          <div class="flex items-center gap-1 mr-3 border-r border-border pr-3">
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
          <div class="flex items-center gap-1 mr-3 border-r border-border pr-3">
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

            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  :variant="editor?.isActive('link') ? 'default' : 'ghost'"
                  @click="editor?.chain().focus().toggleLink({ href: '' }).run()"
                >
                  <span class="icon-[lucide--link] size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Link</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <!-- Media -->
          <div class="flex items-center gap-1 mr-3 border-r border-border pr-3">
            <MediaSelect
              v-model="selectedMedias"
              :multiple="false"
              :immediate="true"
              :types="['PHOTO', 'VIDEO']"
              trigger-text="رسانه"
              trigger-icon="icon-[lucide--image]"
              title="انتخاب تصویر یا ویدیو"
              description="تصویر یا ویدیو مورد نظر خود را انتخاب کنید"
              @update:model-value="handleMediaSelection"
            />
          </div>

          <!-- Undo/Redo -->
          <div class="flex items-center gap-1 mr-3 border-r border-border pr-3">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon" class="size-8"
                  variant="ghost"
                  :disabled="!editor?.can().chain().focus().undo().run()"

                  @click="editor?.chain().focus().undo().run()"
                >
                  <span class="icon-[lucide--undo] size-4" />
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
                  <span class="icon-[lucide--redo] size-4" />
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
      class="editor-content-wrapper"
      :class="{ 'flex-1 flex flex-col': isFullscreen }"
    >
      <TiptapEditorContent
        :editor="editor"
        class="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none focus:outline-none" :class="[
          isFullscreen
            ? 'flex-1 p-8 overflow-y-auto'
            : 'min-h-[200px] p-6',
        ]"
      />
    </div>

    <!-- Fullscreen Overlay -->
    <div
      v-if="isFullscreen"
      class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
      @click="closeFullscreen"
    />
  </div>
</template>

<style scoped>
/* Custom editor styles */
:deep(.ProseMirror) {
  outline: none;
  min-height: 200px;
  padding: 1rem;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: hsl(var(--muted-foreground));
  pointer-events: none;
  float: left;
  height: 0;
}

:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.ProseMirror img:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.ProseMirror video) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  margin: 1rem 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid hsl(var(--border));
  padding-left: 1rem;
  font-style: italic;
  margin: 1rem 0;
}

:deep(.ProseMirror pre) {
  background-color: hsl(var(--muted));
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

:deep(.ProseMirror code) {
  background-color: hsl(var(--muted));
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

:deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid hsl(var(--border));
  margin: 1rem 0;
}

:deep(.ProseMirror ul, .ProseMirror ol) {
  margin-left: 1.5rem;
  margin: 1rem 0;
}

:deep(.ProseMirror h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

:deep(.ProseMirror h1:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

:deep(.ProseMirror h2:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

:deep(.ProseMirror h3:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror h4) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

:deep(.ProseMirror h4:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror h5) {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
  line-height: 1.5;
}

:deep(.ProseMirror h5:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror h6) {
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  line-height: 1.5;
}

:deep(.ProseMirror h6:first-child) {
  margin-top: 0;
}

/* Focus and selection styles */
:deep(.ProseMirror-focused) {
  outline: none;
}

:deep(.ProseMirror ::selection) {
  background-color: hsl(var(--primary) / 0.3);
}

/* List styles */
:deep(.ProseMirror ul) {
  list-style-type: disc;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
}

:deep(.ProseMirror li) {
  margin: 0.25rem 0;
}

/* Paragraph spacing */
:deep(.ProseMirror p) {
  margin: 0.5rem 0;
}

:deep(.ProseMirror p:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}
</style>
