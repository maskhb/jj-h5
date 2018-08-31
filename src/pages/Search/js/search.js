import MJSearch from '@/components/search.vue'
import SearchHistory from '@/components/searchHistory.vue'

import { Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem
} from 'vux'

export default {
  components: {
    Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, MJSearch, SearchHistory
  },
  methods: {
    childOnFocus(props){
      console.log('childOnFocus', props);
      this.historyTitle = props.title;
    }
  },

  mounted:function(){

  },
  data () {
    return {
      minHeight:document.documentElement.clientHeight,
      historyTitle:'热门'
    }
  }
}
