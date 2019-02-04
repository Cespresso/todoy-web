import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import MockUtil from "@/MockUtil";
import DAO from "@/API/DAO";
import Todo from "@/API/Entity/Todo"

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    todo: {
      progress: false,
      items: [],
    },
    auth: null,
    token: '',
  },
  mutations: {
    setTodos(state, todo) {
      state.todo = todo;
    },
    setAuth(state, auth) {
      state.auth = auth;
    },
    setToken(state, token) {
      state.token = token;
    }
  },
  actions: {
    async refreshIdToken({commit,state}){
      state.auth.getIdToken(true).then((token:string)=>{
        commit('setToken', token);
      }).catch(()=>{
        commit('setToken', '');
      })
    },
    /**
     * Todoの一覧を取得するアクション
     * @param param0
     */
    async getAllTodosInAPI({commit,state}){
      commit("setTodos",{
        progress:true,
        items:[],
      })
      const dao = DAO.getinstance();
      let token = "";
      let result = null
      token = await state.auth.getIdToken(true).catch((e)=>{
        console.log("失敗しました")
      })
      result = await dao.getAllTodosByAuthToken(token).catch((e)=>{
        console.log("TODOの取得に失敗しました。")
        commit("setTodos",{
          progress: false,
          items: [],
        })
      })
      console.log("アクションが呼び出されました")
      let todos = (result.data) as Todo;
      console.log(result)
      commit("setTodos",{
        progress: false,
        items: todos,
      })
      return Promise.resolve<boolean>(true)
    },
    async postTodo({commit,state}, todo: Todo ) {
      const dao =  DAO.getinstance();
      let token = "";
      let result = null
      token = await state.auth.getIdToken(true).catch((e)=>{
        Promise.reject("トークンの取得に失敗しました")
        console.log("失敗しました")
      })
      result = await dao.postTodo(token,todo).catch((e)=>{
        Promise.reject("TODOの追加に失敗しました。")
        console.log("TODOの追加に失敗しました。")
      })
      return Promise.resolve<boolean>(true)
    },
    /**
     * googleのアカウントでサインインするアクション
     * @param param0
     */
    async singInByGoogle({commit})　{
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log("サインイン成功")
        commit('setAuth', result );

        // ...
      }).catch( function(error) {
        console.log( "サインイン失敗" )
        commit('setAuth', {} );
      });
    },
    /**
     * サインアウトするアクション
     * @param param0 
     */
    async singOutByGoogle({commit}){
      firebase.auth().signOut().then(function() {
        commit('setAuth',{})
        console.log('サインアウト成功')
      }).catch(function(error) {
        console.log('サインアウト失敗')
      });
    }
  },
});
