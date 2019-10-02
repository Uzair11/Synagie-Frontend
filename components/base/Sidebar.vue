<template>
  <a-layout-sider :trigger="null" collapsible theme="dark" breakpoint="md" collapsed-width="0">
    <div v-if="showPage" class="profile">
      <!--<div class="info">
        Welcome
        {{ currentUser | t('email') }}
      </div>

      <a-button type="primary" size="small" @click="logout">Log-out</a-button>-->
    </div>
    <!-- <div v-if="!currentUser || !currentUser.uid" class="profile">
      <nuxt-link to="/">Login</nuxt-link>
    </div>-->

    <a-menu
      v-if="showPage"
      theme="dark"
      mode="inline"
      :open-keys.sync="openMenus"
      :selected-keys="selectedMenus"
      :defaultSelectedKeys="['User']"
      @click="menuClick"
    >
      <a-menu-item key="User">
        <a-icon type="user" />

        <nuxt-link to="/cp1/user" class="member_menu menu_course">Users</nuxt-link>
      </a-menu-item>
      <a-menu-item key="Sales">
        <a-icon type="global" />

        <nuxt-link to="/cp1/sales">Admin Sales</nuxt-link>
      </a-menu-item>
      <a-menu-item key="Promotions">
      <a-icon type="gift" />

      <nuxt-link to="/cp1/promotions" class="member_menu menu_course">Promotions</nuxt-link>
    </a-menu-item>
    </a-menu>
    
    <a-layout-sider />
  </a-layout-sider>
</template>

<script>
import {
  Menu as AMenu,
  Icon as AIcon,
  Layout as ALayout,
  Button as AButton
} from 'ant-design-vue'
import { mapState, mapActions } from 'vuex'
const ALayoutSider = ALayout.Sider
const AMenuItem = AMenu.Item
// const ASubMenu = AMenu.SubMenu

export default {
  components: {
    AMenu,
    AMenuItem,
    // ASubMenu,
    AIcon,
    // ALayout,
    ALayoutSider,
    AButton
  },

  data() {
    let openMenus = []

    let selectedMenus = []
    // console.log('this.$route.name.', this.$route)
    const adminPath = '/cp1/'
    if (this.$route.path.startsWith(adminPath + 'sales')) {
      selectedMenus.push('Sales Order')
    } else if (this.$route.path.startsWith(adminPath + 'users')) {
      selectedMenus.push('users')
    } else {
      const path = this.$route.path.substring(adminPath.length + 1)
      selectedMenus.push(
        path.substring(
          0,
          path.indexOf('/') >= 0 ? path.indexOf('/') : path.length
        )
      )
    }

    // console.log('name: ', this.$route.name, openMenus, selectedMenus)
    return {
      openMenus: openMenus,
      selectedMenus: selectedMenus,
      showPage: false
    }
  },

  computed: {
    ...mapState('env', ['sidebarCollapsed']),
    ...mapState('session', ['currentUser'])
  },
  mounted() {
    if (this.currentUser) {
      this.showPage = true
    }
  },
  watch: {
    openMenus(val) {
      console.log('openMenus', val)
    }
  },

  methods: {
    menuClick(e) {
      this.$store.dispatch('env/setTitle', e.key)
      this.selectedMenus = e.keyPath
      if (this.$route.path.indexOf(e.key.toLowerCase()) === -1) {
        // this.$router.push(e.keyPath);
      }
    },
    ...mapActions('session', ['logout'])
  }
}
</script>

<style type='scss'>
.profile {
  text-align: center;
}

.ant-layout-sider-collapsed .profile .info {
  visibility: hidden;
  height: 10px;
}
.dashboard .ant-layout-sider {
  width: 100px !important;
  max-width: 100px !important;
  min-width: 100px !important;
  position: fixed;
  overfolw-x: scroll;
  height: 100%;
  float: left;
  background-color: #3d3c3c;
  padding-top: 80px;
}
.dashboard .ant-layout-sider ul {
  background-color: #3d3c3c;
}
.dashboard .ant-layout-sider ul li {
  padding: 5px 10px !important;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #474646;
  margin: 0 !important;
  height: auto;
  border-left: 2px solid transparent;
}
.dashboard .ant-layout-sider ul li.ant-menu-item-selected {
  background-color: transparent;
  border-left-color: #ff9900;
}
.dashboard .ant-layout-sider ul li:hover {
  background-color: #424141;
}
.dashboard .ant-layout-sider ul li i {
  display: block;
  margin: 0;
  color: #fff;
  font-size: 20px;
}
.dashboard .ant-layout-sider ul li a {
  position: relative;
  left: 0;
  color: #fff;
}
.dashboard .ant-tabs-nav .ant-tabs-tab-active,
.dashboard .ant-tabs-nav .ant-tabs-tab:hover {
  color: #ff9900;
}
.dashboard .ant-tabs-ink-bar {
  background-color: #f90;
}
</style>
