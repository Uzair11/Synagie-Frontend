<template>
  <div class="login"
    v-bind:style="{ backgroundImage: 'url(' + require('@/assets/Ware-house.png') + ')' , backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'}"
  >
    <div class="header">
      <div class="logo">
        <img src="~/assets/logo-full.png" />
      </div>
    </div>
    <div class="headings">
      <h1>Sign In</h1>
      <h4>Please Sign In</h4>
    </div>
    <form method="post" name="form3" @submit.prevent="handleSubmit">
      <a-form-item>
        <a-input v-model="username" size="large" type="text" placeholder="Email">
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          v-model="password"
          size="large"
          type="password"
          autocomplete="false"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" />
        </a-input>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loading"
        >Log me in</a-button>
        <div class="forget_pass">
          <a @click="showPasswordModal">Forget Password?</a>
        </div>
        <!--    <div class="okta">
          <a href="#">Login with Okta</a>
        </div>-->
      </a-form-item>
    </form>
    <br />

    <div>
      <a href="/reset-password" style="color: red; text-decoration: underline;" />
    </div>
    <a-modal title="Reset User Password" v-model="passwordModal">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="updatePassword">Proceed</a-button>
      </template>
      <a-form
        layout="horizontal"
        method="post"
        class="frm"
        :form="updatePasswordform"
        @submit.prevent="handleSubmit"
      >
        <fieldset>
          <a-form-item
            label="Email"
            :label-col="updatePasswordformItemLayout.labelCol"
            :wrapper-col="updatePasswordformItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Email"
              type="text"
              v-decorator="[
          'Email',
          {rules: [{ required: true, message: 'Email is required' }]}
        ]"
            />
          </a-form-item>
          <a-form-item
            label="Password"
            :label-col="updatePasswordformItemLayout.labelCol"
            :wrapper-col="updatePasswordformItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Password"
              type="password"
              v-decorator="[
          'Password',
          {rules: [{ required: true, message: 'Password is required' }]}
        ]"
            />
          </a-form-item>
          <a-form-item
            label="Confirm Password"
            :label-col="updatePasswordformItemLayout.labelCol"
            :wrapper-col="updatePasswordformItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Confirm Password"
              type="password"
              v-decorator="[
          'ConfirmPassword',
          {rules: [{ required: true, message: 'Confirm Password is required' }]}
        ]"
            />
          </a-form-item>
        </fieldset>
      </a-form>
    </a-modal>
    <br />
  </div>
</template>

<script>
import Vue from 'vue'
import {
  Button as AButton,
  Form as AForm,
  InputNumber as AInputNumber,
  Input as AInput,
  Select as ASelect,
  Radio as ARadio,
  Spin as ASpin,
  Modal as AModal,
  Switch as ASwitch,
  Icon as AIcon,
  message
} from 'ant-design-vue'
Vue.prototype.$message = message
import Verify from '../../components/login/Verify'
import { mapState, mapActions } from 'vuex'
const AInputGroup = AInput.Group
const ARadioGroup = ARadio.Group
const ASelectOption = ASelect.Option
const AFormItem = AForm.Item
const ARadioButton = ARadio.Button

export default {
  components: {
    AButton,
    AInputNumber,
    AInput,
    AInputGroup,
    ARadio,
    ARadioGroup,
    ARadioButton,
    ASelect,
    ASelectOption,
    ASpin,
    ASwitch,
    AForm,
    AFormItem,
    Verify,
    AModal,
    AIcon
  },
  props: {
    defaultUsername: {
      default: '',
      type: String
    },
    defaultPassword: {
      default: '',
      type: String
    },
    title: {
      default: 'Login',
      type: String
    }
  },
  data(ctx) {
    // console.log('context', ctx.$store)
    return {
      submitted: false,
      username: ctx.defaultUsername,
      password: ctx.DefaultPassword,
      stitch: ctx.$store.state.env.stitch,
      verifyShow: false,
      passwordModal: false,
      updatePasswordform: this.$form.createForm(this),
      verifyEmail: ''
    }
  },
  computed: {
    updatePasswordformItemLayout() {
      // let formLayout = 'horizontal'
      return {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 }
      }
    },
    ...mapState('session', ['loading'])
  },
  mounted() {
    // console.log(this.$moment)
    this.emptyState()
  },
  created() {
    // reset login status
    // this.logout()
  },
  methods: {
    async resendVerify() {
      this.verifyShow = true
    },
    showPasswordModal(e) {
      this.passwordModal = true
    },
    updatePassword() {
      this.updatePasswordform.validateFields((err, values) => {
        if (!err) {
          if (values.Password != values.ConfirmPassword) {
            this.$message.error('Passwords are not matching')
          } else {
            let updateRequest = {}
            updateRequest.password = values.Password
            updateRequest.email = values.Email
            this.update(updateRequest)
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.passwordModal = false
    },
    async update(params) {
      try {
        let res = await this.updateUserPassword(params)
        this.$message.success('Password is updated successfully')
      } catch (e) {
        this.$message.error('Failed to update password')
        this.passwordModal = false
        this.$store.dispatch('user/loading', false)
      }
    },
    ...mapActions('session', ['emptyState']),
    ...mapActions('user', ['updateUserPassword']),
    async handleSubmit() {
      this.submitted = true
      const { username, password } = this

      if (!username || !password) {
        this.$message.error('Please enter Username and Password')

        return
      }
      // console.log('login2?', username, password)
      // console.log('login', username, password, this)
      try {
        let res = await this.$store.dispatch('session/login', {
          username: username,
          password: password
        })
        let msg = res.isAdmin
          ? `successfully logged in as Super Admin with id: ${username}`
          : `successfully logged in as ${res.role} with id: ${username}`
        this.$message.success(msg)
        console.log(`successfully logged in with id: ${username}`)

        this.$router.push(this.$route.query.redirect || '/cp1/user')
      } catch (e) {
        this.$message.error('Login Failed')
        console.error('login failed', e)
      }
      this.submitted = false
    } // handleSubmit
  }
}
</script>

<style lang='scss'>
.ant-layout-header {
  padding: 0;
  height: auto;
}
.login .header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  padding: 30px 25px;
  text-align: left;
}
.login .header .logo {
  width: 250px;
}
.login .header .logo img {
  width: 100%;
}
.ant-layout-content {
  padding: 0;
}
.login .headings {
  text-align: center;
  padding: 50px 0;
}
.login .headings h1 {
  font-size: 90px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
  color: #fff;
  position: relative;
  display: inline-block;
  margin: 0;
  padding: 5px 0;
}
.login .headings h1::before {
  content: '';
  position: absolute;
  border-bottom: 3px solid #ff9900;
  width: 55px;
  bottom: 0;
  left: 43%;
}
.login .headings h4 {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  margin: 0;
  padding: 10px 0;
  font-weight: 300;
}
.login form {
  width: 30%;
  margin: 0 auto;
}
.login form i {
  color: #fff;
  font-size: 16px;
  padding-top: 15px;
}
.login .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
  border-color: transparent;
  border-bottom-color: #fff;
}
.login form input {
  background-color: transparent;
  border: none;
  border-radius: 0;
  color: #fff;
  padding: 15px 40px !important;
  margin-top: 15px;
  font-family: 'Poppins', sans-serif;
  height: auto;
  border-bottom: 1px solid #fff;
  font-size: 14px;
}
.login form input:hover {
  border-bottom-color: #fff !important;
}
.login form input:focus {
  box-shadow: none;
  border: none !important;
  border-bottom: 1px solid #fff !important;
}
.login form button {
  width: 100%;
  background-color: #ff9900;
  border-radius: 12px;
  border-color: #ff9900;
  font-size: 15px;
  font-family: 'Poppins', sans-serif;
  padding: 12px 16px;
  display: block;
  height: auto;
  margin-top: 20px;
}
.login form button:hover,
.login form button:focus {
  background-color: transparent;
  color: #ff9900;
  border-color: #ff9900;
}
.login form .forget_pass {
  padding: 10px 0;
}
.login form a {
  color: #fff;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}
.login form a:hover {
  color: #ff9900;
}
.login form .remember {
  float: right;
  color: #fff;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}
.login form .remember input {
  display: none;
  width: 22px;
  margin: 0;
}
.login form .remember label {
  margin: 0;
  cursor: pointer;
}
.login form .remember input + label {
  padding-left: 0;
}
.login form .remember input + label::before {
  border: 2px solid #fff;
  background-color: transparent;
  content: '';
  width: 22px;
  height: 22px;
  display: inline-block;
  margin-left: 5px;
  font-size: 18px;
  font-family: fontawesome;
  font-weight: normal;
  line-height: 19px;
  vertical-align: bottom;
  text-align: center;
  cursor: pointer;
  position: relative;
  top: -10px;
}
.login form .remember input + label:hover::before {
  border-color: #ff9900;
}
.login form .remember input:checked + label::before {
  content: '\f00c';
  color: #ff9900;
}
.login form .okta {
  text-align: center;
}
.ant-layout-footer address {
  color: #fff;
  margin: 0;
  float: left;
}
.ant-layout-footer ul {
  margin: 0;
  padding: 0;
  float: right;
  color: #fff;
}
.ant-layout-footer ul li {
  display: inline-block;
}
.ant-layout-footer ul li a {
  color: #fff;
}

@media only screen and (max-width: 767px) {
  .ant-layout-content form {
    width: 100%;
  }
  .ant-layout-footer {
    padding: 10px;
  }
  .ant-layout-footer ul {
    float: left;
  }
}
.ant-modal-close-x {
  display: block;
  font-style: normal;
  vertical-align: baseline;
  text-align: center;
  text-transform: none;
  text-rendering: auto;
  width: 56px;
  height: 56px;
  line-height: 20px;
  font-size: 16px;
}
</style>
