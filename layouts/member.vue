<template>
  <a-layout id="components-layout-demo-custom-trigger" class="dashboard">
    <Sidebar />
    <div class="header">
      <n-link to="/cp1" class="logo"></n-link>
      <div class="user">
        <div class="dropdown">
          <button type="button" data-toggle="dropdown">
            <div class="img-container">
              <img src="~/assets/avatar.jpg" />
            </div>
            <i class="fa fa-angle-down"></i>
          </button>
          <div class="dropdown-menu" v-if="showPage && currentUser">
            <a class="dropdown-item" href="#">{{ currentUser | t('email') }} - {{ currentUser.role}}</a>
            <!-- <a class="dropdown-item">
                {{ currentUser.role }}
            </a>-->
            <a class="dropdown-item" href="#">
              <i class="fa fa-user-circle"></i> My Profile
            </a>
            <a class="dropdown-item" href="#">
              <i class="fa fa-user-circle"></i> Accounts Event
            </a>
            <a class="dropdown-item" @click="logout">
              <i class="fa fa-power-off"></i> Sign Out
            </a>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <a-layout>
      <a-layout-header>
        <h2>{{ title }}</h2>
      </a-layout-header>

      <a-layout-content class="contentBody">
        <FlashMessage />
        <nuxt />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import FlashMessage from '../components/base/FlashMessage'
import Footer from '../components/base/Footer'
import Sidebar from '../components/base/Sidebar'
import { StandardError } from '../errors/base'
import { mapState, mapActions } from 'vuex'

import { Layout as ALayout, Icon as AIcon } from 'ant-design-vue'

const ALayoutContent = ALayout.Content
const ALayoutHeader = ALayout.Header

export default {
  components: {
    ALayoutContent,
    ALayout,
    ALayoutHeader,
    AIcon,
    FlashMessage,
    Sidebar,
    Footer
  },
  data() {
    return {
      showPage: false
    }
  },
  computed: {
    ...mapState('env', ['sidebarCollapsed', 'title']),
    ...mapState('session', ['currentUser'])
  },
  mounted() {
    if (this.currentUser) {
      this.showPage = true
    }
  },
  methods: {
    ...mapActions('env', ['toogleMenu']),
    ...mapActions('session', ['logout'])
  }
}
</script>

<style>
.dashboard {
  font-family: 'Open Sans', sans-serif;
}
.dashboard .header {
  position: fixed;
  background-color: #ff9900;
  padding: 0;
  width: 100%;
  z-index: 999;
  top: 0;
}
.dashboard .header .logo {
  background-color: #3d3c3c;
  color: #ffffff;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 80px;
  height: 80px;
  width: 100px;
  background-image: url('../assets/logo.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 75px auto;
  margin-right: 20px;
  border-bottom: 1px solid #474646;
  display: block;
  float: left;
}
.dashboard .user {
  float: right;
}
.dashboard .user button {
  background: transparent;
  border: none;
  padding: 15px 50px;
}
.dashboard .user button:focus {
  outline: unset;
}
.dashboard .user button i {
  color: #fff;
  padding: 15px;
  font-size: 16px;
}
.dashboard .user a {
  font-size: 12px;
  color: #504e4e;
  transition: all ease-in-out 0.3s;
  padding: 5px 20px;
}
.dashboard .user a:hover {
  color: #fff;
  background-color: #ff9900;
}
.dashboard .user .img-container {
  width: 43px;
  height: 43px;
  border-radius: 100%;
  overflow: hidden;
  float: left;
}
.dashboard .user .img-container img {
  width: 100%;
}
.clear {
  clear: both;
  float: none;
}
.dashboard .ant-layout {
  display: block;
  margin-top: 80px;
}
.dashboard .ant-layout-header {
  background-color: #fff;
  height: auto;
}
.dashboard .ant-layout-header h2 {
  padding: 20px 115px;
  margin: 0;
  font-weight: normal;
  font-weight: 300;
  font-size: 28px;
}
.dashboard .ant-layout-content {
  width: 92%;
  float: right;
  padding: 30px 50px;
}
.dashboard .ant-modal-mask {
  z-index: 9999;
}
.ant-modal .ant-modal-content {
  border-radius: 0;
}
.ant-modal .ant-modal-content button.ant-modal-close {
  color: #fff;
  font-size: 12px;
  width: auto;
  height: auto;
  line-height: auto;
  padding: 30px 15px;
  opacity: 0.5;
}
.ant-modal .ant-modal-content button.ant-modal-close:hover {
  opacity: 1;
}
.ant-modal .ant-modal-content .ant-modal-header {
  background-color: #ff9900;
  border-radius: 0;
  padding: 30px 20px;
}
.ant-modal .ant-modal-content .ant-modal-header .ant-modal-title {
  color: #fff;
  font-size: 23px;
  font-weight: 300;
}
.ant-modal .ant-modal-content .ant-modal-body .ant-form-item-label {
  text-align: left;
}
.ant-modal .ant-modal-content .ant-modal-body input {
  border-radius: 0;
}
.ant-modal .ant-modal-content .ant-modal-body input:hover {
  border-color: #e0e0e0;
}
.ant-modal .ant-modal-content .ant-modal-body label .ant-radio-inner {
  border-color: #ff9900;
}
.ant-modal .ant-modal-content .ant-modal-body label .ant-radio-inner:after {
  background-color: #ff9900;
}
.ant-modal .ant-modal-content .ant-modal-footer button {
  border-radius: 0;
  font-size: 13px;
  font-weight: 300;
}
.ant-modal .ant-modal-content .ant-modal-footer button.ant-btn-primary {
  background-color: #ff9900;
  border-color: #ff9900;
}
.dashboard .ant-pagination-item {
  color: #f90;
  border-color: #f90;
}
.dashboard .ant-pagination-item:hover a {
  color: #f90;
}
.dashboard .ant-pagination-item:focus a {
  color: #fff;
}
.dashboard .ant-pagination-item-active {
  border-color: #f90;
  background-color: #f90;
  color: #fff;
}
</style>
