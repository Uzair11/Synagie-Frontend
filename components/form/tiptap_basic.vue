<template>
  <div class="editor">
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive, menu }">
      <div class="menubar">
        <div class="toolbar">
          <button class="menubar__button" @click="commands.undo">
            <a-icon type="undo" />
          </button>

          <button class="menubar__button" @click="commands.redo">
            <a-icon type="redo" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
            type="button"
          >
            <a-icon type="bold" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
            type="button"
          >
            <a-icon type="italic" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
            type="button"
          >
            <a-icon type="strikethrough" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
            type="button"
          >
            <a-icon type="underline" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
            type="button"
          >
            <a-icon type="code" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
            type="button"
          >
            <icon name="paragraph" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
            type="button"
          >H1</button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
            type="button"
          >H2</button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
            type="button"
          >H3</button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
            type="button"
          >
            <a-icon type="bars" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
            type="button"
          >
            <a-icon type="ordered-list" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
            type="button"
          >
            <icon name="quote" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
            type="button"
          >
            <a-icon type="code" />
          </button>

          <button
            class="menubar__button"
            type="button"
            @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
          >
            <a-icon type="table" />
          </button>

          <span v-if="isActive.table()">
            <button class="menubar__button" @click="commands.deleteTable" type="button">
              <icon name="delete_table" />
            </button>
            <button class="menubar__button" @click="commands.addColumnBefore" type="button">
              <icon name="add_col_before" />
            </button>
            <button class="menubar__button" @click="commands.addColumnAfter" type="button">
              <icon name="add_col_after" />
            </button>
            <button class="menubar__button" @click="commands.deleteColumn" type="button">
              <icon name="delete_col" />
            </button>
            <button class="menubar__button" @click="commands.addRowBefore" type="button">
              <icon name="add_row_before" />
            </button>
            <button class="menubar__button" @click="commands.addRowAfter" type="button">
              <icon name="add_row_after" />
            </button>
            <button class="menubar__button" @click="commands.deleteRow" type="button">
              <icon name="delete_row" />
            </button>
            <button class="menubar__button" @click="commands.toggleCellMerge" type="button">
              <icon name="combine_cells" />
            </button>
          </span>

          <button class="menubar__button" type="button" @click="showImagePrompt(commands.image)">
            <a-icon type="file-jpg" />
          </button>
        </div>
      </div>
    </editor-menu-bar>

    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Image,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'
import { Icon as AIcon } from 'ant-design-vue'
import { schema } from 'prosemirror-markdown'
import Icon from './icon/index'
// const { schema } = require('prosemirror-schema-basic')

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
    AIcon
  },
  props: {
    value: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    const scoped = this
    return {
      changeIndex: 1,
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Image(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Table({
            resizable: true
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow()
        ],
        content: this.value,
        onUpdate: function(e) {
          // onBlur - cannot use because te html generated are missing strong/italic and stuffs
          // console.log('updtae', e.state.doc)
          // const el = document.createElement('_')
          // let fragment = DOMSerializer.fromSchema(schema).serializeFragment(
          //   e.state.doc.content
          // )
          // el.appendChild(e.state.doc.content.toDOM())
          // el.appendChild(fragment)
          // scoped.$emit('input', el.innerHTML)
          // return el.innerHTML
          scoped.changeIndex += 1
          const newIndex = scoped.changeIndex
          setTimeout(function() {
            if (scoped.changeIndex === newIndex) {
              scoped.$emit('input', e.getHTML())
            }
          }, 1000)
          // onUpdate
          // console.log('update', e, scoped)
        }
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    showImagePrompt(command) {
      const src = prompt('Enter the url of your image')
      if (src !== null) {
        command({ src })
      }
    }
  }
}
</script>
