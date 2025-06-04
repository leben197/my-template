import { http } from "@/utils/http";
import { defineStore } from "pinia";

interface UserState {
  id: string | null;
  name: string;
  token: string | null;
  avatar: string;
  roles: string[];
  permissions: string[];
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    id: null,
    name: "",
    token: localStorage.getItem("token"),
    avatar: "",
    roles: [],
    permissions: [],
  }),

  getters: {
    isLogin: (state) => !!state.token,
    hasRole: (state) => (role: string) => state.roles.includes(role),
    hasPermission: (state) => (permission: string) =>
      state.permissions.includes(permission),
  },

  actions: {
    async login(username: string, password: string) {
      try {
        const res = await http.post<{ token: string; userInfo: any }>(
          "/auth/login",
          {
            username,
            password,
          }
        );

        this.token = res.data.token;
        localStorage.setItem("token", this.token);

        // 获取用户信息
        return await this.getUserInfo();
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async getUserInfo() {
      try {
        const res = await http.get<{
          id: string;
          name: string;
          avatar: string;
          roles: string[];
          permissions: string[];
        }>("/user/info");

        this.id = res.data.id;
        this.name = res.data.name;
        this.avatar = res.data.avatar;
        this.roles = res.data.roles;
        this.permissions = res.data.permissions;

        return res.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    logout() {
      this.token = null;
      this.id = null;
      this.name = "";
      this.avatar = "";
      this.roles = [];
      this.permissions = [];
      localStorage.removeItem("token");
    },
  },
});
