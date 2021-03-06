import Searcher from '../Searcher/Searcher.vue';
import ResultList from '../ResultList/ResultList.vue';
import Pagination from '../Pagination/Pagination.vue';
import axios from 'axios';
import md5 from 'js-md5';

export default {
  name: 'ComicsPage',
  components : {
    Searcher,
    ResultList,
    Pagination,
  },
  data(){
    return {
      searchValue : '',
      searchResult : '',
      publicKey : 'bf687835d52f6e1edbf3f57a23909ee7',
      privateKey : '9cf606ee3551955f5f31313af14b785c6dc2919c',
      comicsPerPage : 10,
      currentPage : 0,
      totalPages : 0,
    }
  },
  methods : {
    saveSearchValue(searcherInputValue){
      this.searchValue = searcherInputValue;
      this.requestComics();
    },
    requestComics(){
      const url = this.generateUrl();
      axios.get(url)
        .then( response => {
          this.searchResult = response.data.data.results;
          this.totalPages = Math.ceil(response.data.data.total / this.comicsPerPage);
        }).catch( error => {
          console.log('An error ocurred: ' + error);
        })
    },
    generateUrl(){
      const now = Date.now();
      const baseUrl = 'http://gateway.marvel.com/';
      const endPoint = 'v1/public/comics';
      const offset = '&offset=' + (this.currentPage - 1) * this.comicsPerPage;
      const limit = '&limit=' + this.comicsPerPage;
      const apikey = '&apikey=' + this.publicKey;
      const hash = '&hash=' + md5(now + this.privateKey + this.publicKey);

      if(this.searchValue !== ''){
        const searchingTitle = '?titleStartsWith=' + this.searchValue;
        const ts = '&ts=' + now;
        return baseUrl + endPoint + searchingTitle + ts + offset + limit + apikey + hash;
      }else{
        const ts = '?ts=' + now;
        return baseUrl + endPoint + ts + offset + limit + apikey + hash;
      }
    }
  },
  created(){
    this.currentPage = this.$route.params.page;
    if(this.$route.path === '/comics') this.currentPage = 1;
    this.requestComics();
  },
  watch: {
    '$route' () {
      this.currentPage = this.$route.params.page;
      if(this.$route.path === '/comics') this.currentPage = 1;
      this.requestComics();
    }
  }
}
