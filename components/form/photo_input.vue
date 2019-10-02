<template>
  <div>
    <a :href="value.pathURL.original" target="_blank" v-if="value.pathURL">{{value.name}}</a>
    <p>
      <img
        v-if="value.pathURL && value.pathURL.original && value.fileType=='image'"
        :src="value.pathURL.original"
        alt="image"
        style="max-height: 200px; max-width: 500px;"
      />
      <img
        v-else-if="value.pathURL && value.fileType=='image'"
        :src="value.pathURL"
        alt="image"
        style="max-height: 200px; max-width: 500px;"
      />
      <video
        controls
        v-else-if="value.pathURL && value.fileType=='video'"
        :src="value.pathURL.original"
        style="max-height: 200px; max-width: 500px;"
      />
      <a-upload
        v-else-if="!value.pathURL"
        list-type="picture-card"
        class="avatar-uploader"
        :file-list="files"
        type="select"
        :show-upload-list="false"
        @change="function(e) { return handleUpload(e) } "
      >
        <div>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </p>
    <a-upload
      v-if="value.pathURL"
      list-type="text"
      class="avatar-uploader"
      :file-list="files"
      type="select"
      :show-upload-list="false"
      @change="function(e) { return handleUpload(e) } "
    >
      <div style="cursor: pointer">
        <div class="ant-upload-text">Change</div>
      </div>
    </a-upload>
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
import { cloneData } from '../../shared/general'

// const AListvalue = AList.value
const AInputGroup = AInput.Group
const ASelectOption = ASelect.Option

export default {
  components: {
    AList,
    // AListvalue,
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
      type: Object,
      default: () => {
        return {
          storageType: 'google',
          weight: 99,
          isPrivate: false,
          path: '',
          pathFile: null,
          fileType: null
        }
      }
    }
  },
  data() {
    return { loading: false, photoLoading: false, files: [] }
  },
  computed: {
    ...mapState('session', ['currentUser'])
  },
  mounted() {},
  methods: {
    async handleUpload(upload) {
      if (this.loading) return
      console.log('upload?', this.value, upload)

      this.pathFile = upload.file
      try {
        this.doUpload()
      } catch (e) {
        this.$store.dispatch('alert/error', e.message)
      }
    },
    async doUpload() {
      this.loading = true
      console.log('doupload', this.pathFile)
      let i = this.pathFile
      if (i) {
        this.pathFile = null
        let isNew = !this.value._id

        let value = cloneData(this.value)

        let matchName = value.name === value.filename
        value.filename = i.name
        value.mimeType = i.originFileObj.type
        if (!value.mimeType.startsWith('image/') || !value.mimeType) {
          throw new Error('Invalid file type')
        }

        if (isNew) {
          console.log('saving new file', value, i)
          value.name = i.name
          value = cloneData(await this.$store.dispatch('file/saveFile', value))
        }

        if (matchName) {
          value.name = i.name
        }

        // console.log('uploading file.......', value)
        let res = await this.$store.dispatch('file/uploadFile', {
          name: i.name,
          field: 'path',
          file: i.originFileObj,
          userId: this.currentUser.uid,
          fileId: value._id,
          updateName: true
        })
        // console.log('uploaded', res)
        value = cloneData(res.file)
        // this.file.path = res.path
        value = await this.$store.dispatch('file/loadFile', value)
        console.log('after upload', value)
        // this.value = value
        // console.log('uploading file done.')
        this.$emit('change', value)
        this.$emit('update:value', value)
      }
      this.files = []
      this.loading = false
      // this.$forceUpdate()
      return true
    },
    resetFile() {
      let val = {
        storageType: 'google',
        weight: 99,
        isPrivate: false,
        path: '',
        pathFile: null,
        fileType: null
      }
      this.$emit('change', this.length - 1, val)
      this.$emit('update:value', this.value)
    },

    onInput(e) {
      console.log('input', e)
      this.$emit('change', this.value)
      this.$emit('update:value', this.value)
    },
    deletevalue() {
      if (!confirm('Confirm remove?')) {
        return
      }

      // console.log('delete', i)
      // console.log('list', this.value)
      this.$emit('change', null)
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
