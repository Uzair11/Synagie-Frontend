<template>
  <div>
    <a-list size="small" bordered :data-source="value">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-spin tip="Loading..." :spinning="photoLoading[index]">
          <a-row>
            <a-col :span="20">
              <a :href="item.pathURL.original" target="_blank" v-if="item.pathURL">{{item.name}}</a>
              <p>
                <img
                  v-if="item.pathURL && item.pathURL.original && item.fileType=='image'"
                  :src="item.pathURL.original"
                  alt="image"
                  style="max-height: 200px; max-width: 500px;"
                />
                <img
                  v-else-if="item.pathURL && item.fileType=='image'"
                  :src="item.pathURL"
                  alt="image"
                  style="max-height: 200px; max-width: 500px;"
                />
                <video
                  controls
                  v-else-if="item.pathURL && item.fileType=='video'"
                  :src="item.pathURL.original"
                  style="max-height: 200px; max-width: 500px;"
                />
                <a-upload
                  v-else-if="!item.pathURL"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :file-list="files"
                  type="select"
                  :show-upload-list="false"
                  @change="function(e) { return handleUpload(index, e) } "
                >
                  <div>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </p>
              <a-upload
                v-if="item.pathURL"
                list-type="text"
                class="avatar-uploader"
                :file-list="files"
                type="select"
                :show-upload-list="false"
                @change="function(e) { return handleUpload(index, e) } "
              >
                <div style="cursor: pointer">
                  <div class="ant-upload-text">Change</div>
                </div>
              </a-upload>
            </a-col>
            <a-col :span="4" style="padding-left: 5px;">
              <a href="javascript:" @click="deleteItem(index)">
                <a-icon type="delete">delete</a-icon>
              </a>
              <a-icon v-if="index > 0" type="caret-up" @click="moveUp(index)" />
              <a-icon v-if="index < value.length-1" type="caret-down" @click="moveDown(index)" />
            </a-col>
          </a-row>
        </a-spin>
      </a-list-item>
      <div slot="header">
        <a href="javascript:" @click="add">+ Add</a>
      </div>
      <div slot="footer">
        <a href="javascript:" @click="add">+ Add</a>
      </div>
    </a-list>
  </div>
</template>

<script lang='ts'>
import { mapState, mapActions } from 'vuex'
import {
  Icon as AIcon,
  Input as AInput,
  Upload as AUpload,
  InputNumber as AInputNumber,
  List as AList,
  Spin as ASpin,
  AutoComplete as AAutoComplete,
  Row as ARow,
  Col as ACol,
  Button as AButton,
  Select as ASelect
} from 'ant-design-vue'
import { cloneData } from '~/shared/general'

const AListItem = AList.Item
const AInputGroup = AInput.Group
const ASelectOption = ASelect.Option

export default {
  components: {
    AList,
    AListItem,
    AButton,
    ASelect,
    ASelectOption,
    ARow,
    ACol,
    AInputGroup,
    AInput,
    AInputNumber,
    AIcon,
    AUpload,
    ASpin
  },

  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    let photoLoading: boolean[] = []
    for (let c = 0; c < this.value.length; c++) {
      photoLoading.push(false)
    }
    return { loading: false, photoLoading: photoLoading, files: [] }
  },
  computed: {
    ...mapState('session', ['currentUser'])
  },
  mounted() {},
  methods: {
    async handleUpload(index, upload) {
      if (this.loading) return
      console.log('upload?', this.value[index], upload)

      this.value[index].pathFile = upload.file
      this.doUpload()
    },
    async doUpload() {
      this.loading = true
      // console.log('doupload', this)
      for (let c = 0; c < this.value.length; c++) {
        let i = this.value[c].pathFile
        if (i) {
          this.photoLoading[c] = true
          this.value[c].pathFile = null
          let isNew = !this.value[c]._id

          let matchName = this.value[c].name === this.value[c].filename
          this.value[c].filename = i.name
          this.value[c].mimeType = i.originFileObj.type

          if (isNew) {
            // console.log('saving new file', this.value[c], i)
            this.value[c].name = i.name
            this.value[c] = cloneData(
              await this.$store.dispatch('file/saveFile', this.value[c])
            )
          }

          if (matchName) {
            this.value[c].name = i.name
          }

          // console.log('uploading file.......', this.value[c])
          let res = await this.$store.dispatch('file/uploadFile', {
            name: i.name,
            field: 'path',
            file: i.originFileObj,
            userId: this.currentUser.uid,
            fileId: this.value[c]._id,
            updateName: true
          })
          // console.log('uploaded', res)
          this.value[c] = cloneData(res.file)
          // this.file.path = res.path
          this.value[c] = await this.$store.dispatch(
            'file/loadFile',
            this.value[c]
          )
          console.log('after upload', this.value[c])
          // console.log('uploading file done.')
          this.photoLoading[c] = false
        }
      } // each c
      // console.log('files?', this.files)
      if (this.files.length > 0) {
        this.files[0].loading = false
      }
      this.loading = false
      this.files = []
      this.$forceUpdate()
      return true
    },
    add() {
      let val = {
        storageType: 'google',
        weight: 99,
        isPrivate: false,
        path: '',
        pathFile: null,
        fileType: null
      }
      this.photoLoading.push(false)
      this.value.push(val)
      this.$emit('change', this.value.length - 1, val)
      this.$emit('update:value', this.value)
    },

    moveUp(index) {
      let rows = this.value.splice(index, 1)
      this.value.splice(index - 1, 0, rows[0])

      this.$emit('change', index, rows[0])
      this.$emit('update:value', this.value)
    },

    moveDown(index) {
      let rows = this.value.splice(index, 1)
      this.value.splice(index + 1, 0, rows[0])

      this.$emit('change', index, rows[0])
      this.$emit('update:value', this.value)
    },

    onInput(e, index) {
      console.log('input', e, index)
      this.$emit('change', index, this.value[index])
      this.$emit('update:value', this.value)
    },
    deleteItem(i) {
      if (!confirm('Confirm remove?')) {
        return
      }

      // console.log('delete', i)
      this.value.splice(i, 1)
      this.photoLoading.splice(i, 1)
      // console.log('list', this.value)
      this.$emit('change', i, null)
      this.$emit('update:value', this.value)
    }
  }
}
</script>

<style type='scss' scoped>
.input {
  width: 100%;
}

.ant-row {
  width: 100%;
}
</style>
