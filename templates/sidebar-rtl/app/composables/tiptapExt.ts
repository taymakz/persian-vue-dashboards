// Export Tiptap extensions with custom prefixes to avoid naming conflicts
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'

// Re-export with custom names
export const TiptapImage = Image
export const TiptapLink = Link
export const TiptapSubscript = Subscript
export const TiptapSuperscript = Superscript
export const TiptapTaskItem = TaskItem
export const TiptapTaskList = TaskList
export const TiptapTextAlign = TextAlign
export const TiptapStarter = StarterKit
