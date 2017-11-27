import axios from 'axios';

export const actions = {
  FETCH_BNNER: 'FETCH_BANNER'
};

export default {
  state: {
    bannerData: []
},
  mutations: {
    [actions.FETCH_BNNER](state, data) {
      Object.assign(state, {bannerData: data});
    }
  },
  actions: {
    [actions.FETCH_BNNER]({commit}) {
      axios.get('/index.php?mod=misc&action=data&keys=hot_banner')
           .then(({ data }) => {
             if (data.code === 200) {
               let bannerData = data.data && data.data.list && data.data.list.hot_banner;
               commit(actions.FETCH_BNNER, bannerData);
             } else {
               console.log(data.message);
             }
           })
           .catch(function(error) {
             console.log(error);
           });
    }
  }
};
