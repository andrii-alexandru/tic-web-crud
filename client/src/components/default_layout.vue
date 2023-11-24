<template>
  <el-container class="layout-container-demo">
    <el-drawer v-model="aside_visible" :show-close="true" direction="ltr" size="auto">
      <el-aside width="auto">
        <el-scrollbar>
          <el-menu :default-openeds="['1', '3']">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <user />
                </el-icon>USER
              </template>
              <el-menu-item-group>
                <template #title>User data section</template>
                <el-menu-item index="1-1">
                  <RouterLink to="/my-account">My Account</RouterLink>
                </el-menu-item>
                <el-menu-item index="1-2" @click="logout">
                  Log out
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group 2">
                <el-menu-item index="1-3">Option 3</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="1-4">
                <template #title>Option4</template>
                <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><icon-menu /></el-icon>Navigator Two
              </template>
              <el-menu-item-group>
                <template #title>Group 1</template>
                <el-menu-item index="2-1">Option 1</el-menu-item>
                <el-menu-item index="2-2">Option 2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group 2">
                <el-menu-item index="2-3">Option 3</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="2-4">
                <template #title>Option 4</template>
                <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon>
                  <setting />
                </el-icon>Navigator Three
              </template>
              <el-menu-item-group>
                <template #title>Group 1</template>
                <el-menu-item index="3-1">Option 1</el-menu-item>
                <el-menu-item index="3-2">Option 2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group 2">
                <el-menu-item index="3-3">Option 3</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="3-4">
                <template #title>Option 4</template>
                <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
    </el-drawer>
    <el-container>
      <el-header>
        <el-row justify="space-between" align="middle" style="height: 100%">
          <el-button type="primary" plain style="margin-left: 16px" @click="aside_visible = true" round>
            <el-icon>
              <Expand />
            </el-icon>
          </el-button>
          <!-- <el-dropdown>
            <el-icon size="40"><CaretBottom /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item><RouterLink to="/login">Login</RouterLink></el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
          <Thememodeswitch />
        </el-row>
      </el-header>

      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import Thememodeswitch from './ThemeModeSwitch.vue'
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';

const router = useRouter()

const aside_visible = ref(false)

const logout = function () {
  const auth = getAuth();
  signOut(auth).then(() => {
    ElMessage({
      message: 'Congrats, you logged in.',
      type: 'success'
    })
    router.push('/login')
  }).catch((error) => {
    ElMessage({
      type: 'error',
      message: error.message
    })
  });
}
</script>

<style scoped>
.layout-container-demo {
  height: 100vh;
}

.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-7);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}
</style>
