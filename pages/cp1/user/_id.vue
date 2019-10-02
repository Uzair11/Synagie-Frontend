<template>
  <div class="contentBody">
    <a-breadcrumb>
      <a-breadcrumb-item href="/cp/user">
        <a-icon type="user" />
        <n-link to="/cp1/user">Users</n-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>User Details</a-breadcrumb-item>
    </a-breadcrumb>

    <a-spin tip="Loading..." :spinning="loading">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="General">
          <a-form
            v-if="loaded"
            layout="horizontal"
            method="post"
            class="frm"
            @submit.prevent="handleSubmit"
          >
            <fieldset>
              <a-form-item
                label="First Name"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input v-model="user.firstName" placeholder="First Name" />
              </a-form-item>

              <a-form-item
                label="Last Name"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input v-model="user.lastName" placeholder="Last Name" />
              </a-form-item>

              <a-form-item
                label="Display Name"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input v-model="user.displayName" placeholder="Display Name" />
              </a-form-item>

              <a-form-item
                label="Photo URL"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-upload
                  name="photo"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  @change="handleUploadPhotoURL"
                >
                  <img
                    v-if="user.photoURL && user.photoURL.original"
                    :src="user.photoURL.original"
                    alt="photoURL"
                    style="max-height: 200px; max-width: 500px;"
                  />
                  <img
                    v-else-if="user.photoURL"
                    :src="user.photoURL"
                    alt="photoURL"
                    style="max-height: 200px; max-width: 500px;"
                  />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </a-form-item>

              <a-form-item
                label="Mobile"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input v-model="user.mobile" placeholder="Mobile" />
              </a-form-item>

              <a-form-item
                label="Created At"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <div>{{ user.createdAt }}</div>
              </a-form-item>

              <a-form-item
                label="Updated At"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <div>{{ user.updatedAt }}</div>
              </a-form-item>

              <a-form-item
                label="Email"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input v-model="user.email" placeholder="Email" />
              </a-form-item>

              <a-form-item
                label="Status"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-select :value="user.status">
                  <a-select-option
                    v-for="option in statusOptions"
                    :key="option.id"
                    :value="option.id"
                  >{{ option.label }}</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item
                label="Gender"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-radio-group v-model="user.gender">
                  <a-radio
                    v-for="option in genderOptions"
                    v-bind:key="option.id"
                    :value="option.id"
                  >{{option.label}}</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item
                label="Stage"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-radio-group v-model="user.stage">
                  <a-radio
                    v-for="option in stageOptions"
                    v-bind:key="option.id"
                    :value="option.id"
                  >{{option.label}}</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item
                label="Is Editor"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-switch v-model="user.isEditor" checked-children="Yes" un-checked-children="No" />
              </a-form-item>

              <a-form-item
                label="Terms"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-switch v-model="user.terms" checked-children="Yes" un-checked-children="No" />
              </a-form-item>

              <a-form-item
                label="Promotion"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-switch v-model="user.promo" checked-children="Yes" un-checked-children="No" />
              </a-form-item>

              <a-form-item
                label="Expected"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <timestamp-input :value.sync="user.expected" :dateOnly="true" />
              </a-form-item>

              <a-form-item
                label="Is Publisher"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-switch
                  v-model="user.isPublisher"
                  checked-children="Yes"
                  un-checked-children="No"
                />
              </a-form-item>

              <a-form-item
                label="Is Admin"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-switch v-model="user.isAdmin" checked-children="Yes" un-checked-children="No" />
              </a-form-item>

              <a-form-item
                label="Identity"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-radio-group v-model="user.identity">
                  <a-radio
                    v-for="option in identityOptions"
                    v-bind:key="option.id"
                    :value="option.id"
                  >{{option.label}}</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item
                label="Race"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-select v-model="user.race">
                  <a-select-option
                    v-for="option in raceOptions"
                    :key="option.id"
                    :value="option.id"
                  >{{ option.label }}</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item
                label="Lang"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-select v-model="user.lang">
                  <a-select-option
                    v-for="option in langOptions"
                    :key="option.id"
                    :value="option.id"
                  >{{ option.label }}</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item
                label="Country"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-select v-model="user.country">
                  <a-select-option
                    v-for="option in countryOptions"
                    :key="option.id"
                    :value="option.id"
                  >{{ option.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </fieldset>

            <a-row type="flex">
              <a-col :offset="formItemLayout.labelCol.span" :span="formItemLayout.wrapperCol.span">
                <a-button type="primary" @click="handleSubmit">Save</a-button>

                <a-button v-if="user && user._id" class="bg-red" @click="confirmDelete">Delete</a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </div>
</template>

<script>
'use strict'

import {
  Tabs as ATabs,
  Form as AForm,
  Upload as AUpload,
  Breadcrumb as ABreadcrumb,
  InputNumber as AInputNumber,
  Input as AInput,
  DatePicker as ADatePicker,
  Select as ASelect,
  Radio as ARadio,
  Spin as ASpin,
  Switch as ASwitch,
  Button as AButton,
  Icon as AIcon,
  Row as ARow,
  Col as ACol,
  Checkbox as ACheckbox
} from 'ant-design-vue'

import { cloneData } from '~/shared/general'
import { StandardError } from '~/errors/base'
import { mapState, mapActions } from 'vuex'
import { differences } from '~/shared/diff'
import _ from 'lodash'
import UserSelect from '~/components/form/user'
import TimestampInput from '~/components/form/timestamp_input'

const ABreadcrumbItem = ABreadcrumb.Item
const AInputGroup = AInput.Group
const ARadioGroup = ARadio.Group
const ASelectOption = ASelect.Option
const AFormItem = AForm.Item
const ARadioButton = ARadio.Button
const ATextarea = AInput.TextArea
const ATabPane = ATabs.TabPane
const ACheckboxGroup = ACheckbox.Group

export default {
  components: {
    // Register
    ATabs,
    ATabPane,
    AUpload,
    ARow,
    ACol,
    AIcon,
    ADatePicker,
    AInputNumber,
    AButton,
    ABreadcrumb,
    ABreadcrumbItem,
    AInput,
    ATextarea,
    AInputGroup,
    ARadio,
    ARadioGroup,
    ARadioButton,
    ACheckboxGroup,
    ACheckbox,
    ASelect,
    ASelectOption,
    ASpin,
    ASwitch,
    AForm,
    AFormItem,
    UserSelect,
    TimestampInput
  },

  data() {
    let res = {
      user: {},
      photoURL: '',
      inputPhotoURL: null,
      loaded: false
    }

    res.statusOptions = [{ id: null, label: '' }]
    res.raceOptions = [
      { id: 1, label: 'Malay' },
      { id: 2, label: 'Chinese' },
      { id: 3, label: 'Indian' },
      { id: 0, label: 'Other' }
    ]
    res.langOptions = [
      { id: 'en', label: 'English' },
      { id: 'zh', label: 'Chinese' },
      { id: 'ms', label: 'Bahasa' }
    ]

    res.genderOptions = [{ id: 1, label: ' Female' }, { id: 2, label: 'Male' }]
    res.stageOptions = [
      { id: 0, label: 'N/A' },
      { id: 1, label: 'Pregnant' },
      { id: 2, label: 'Pre-pregnant' },
      { id: 3, label: 'Child care' }
    ]

    res.identityOptions = [
      { id: 0, label: 'N/A' },
      { id: 1, label: 'Mom' },
      { id: 2, label: 'Dad' }
    ]

    res.countryOptions = [{ id: 'my', label: 'Malaysia' }]

    return res
  },

  computed: {
    ...mapState('user', ['loading']),
    formItemLayout() {
      // let formLayout = 'horizontal'
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
    }
  },
  //
  watch: {
    // user: {
    //   handler(val, oldval) {
    //     if (!this.loaded) return // ignore
    //     // console.log('changed', val, oldval)
    //     console.log('changes', differences(val, this.user))
    //     // do stuff
    //   },
    //   deep: true
    // }
  },

  async created() {
    this.$store.dispatch('env/setTitle', 'User')
    // console.log('query', this.$route.params)
    await this.fetchUser()
    this.loaded = true
  },

  methods: {
    ...mapActions('user', ['setUserField']),
    ...mapActions({
      checkPassword: 'user/checkPassword',
      saveUser: 'user/saveUser'
    }),

    changeCountry(e) {
      console.log('changecountry', e)
      this.user.country = e
      this.$forceUpdate()
    },

    async fetchUser() {
      const id = this.$route.params.id
      try {
        let res = await this.$store.dispatch('user/fetchUser', id)
        this.user = cloneData(this.$store.state.user.record)
      } catch (e) {
        console.error(e)
        this.$store.dispatch('alert/error', e.message)
      }
    },
    async confirmDelete() {
      if (!confirm('Confirm delete? (cannot undo)')) {
        return
      }

      try {
        await this.$store.dispatch('user/deleteUser', this.user._id)
        this.$store.dispatch('alert/successWithOption', {
          message: 'Record has been deleted.',
          link: '/cp1/user',
          linkLabel: 'Return to list'
        })
      } catch (e) {
        this.$store.dispatch('alert/error', e.message)
      }
    },

    async handleUploadPhotoURL(upload) {
      if (this.loading) return
      console.log('upload?', upload)
      this.inputPhotoURL = upload.file
      console.log('PhotoURL', this.inputPhotoURL, this.user)
      if (this.user._id) {
        this.doUploadPhotoURL()
      }
    },
    async doUploadPhotoURL() {
      if (this.inputPhotoURL) {
        let i = this.inputPhotoURL
        console.log('uploading', i)
        let res = await this.$store.dispatch('user/uploadFile', {
          name: i.name,
          field: 'photo',
          file: i.originFileObj,
          userId: this.user._id
        })
        console.log('uploaded', res)

        this.photoURL = res.url
        this.user.photo = res.path
        this.user = await this.$store.dispatch('user/loadUser', this.user)
        this.inputPhotoURL = null
        this.$forceUpdate()
      } else {
        console.error('photoURL input not set')
      }
    },
    async uploadNow2() {
      const files = this.$refs.upload.$el.files
      console.log('files', files)
      if (files.length < 1) {
        alert('please select file')
      }
    },
    async handleSubmit() {
      // this.$router.redirect('/')
      try {
        let isNew = !this.user._id
        let res = await this.saveUser(this.user)
        if (isNew) {
          this.user._id = res._id
          // await this.doUploadThumb()

          this.$router.push('/cp1/user/' + res._id)
        }

        this.$store.dispatch('alert/success', 'Saved')
      } catch (e) {
        console.error('unknown error', e)
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
      }
    }
  },

  layout() {
    return 'member'
  },
  middleware: ['isAuth']
}
</script>

<style>
.ant-spin-spinning {
  display: block;
  position: relative;
  width: 100%;
  min-height: 500px;
  height: 100%;
}
</style>
