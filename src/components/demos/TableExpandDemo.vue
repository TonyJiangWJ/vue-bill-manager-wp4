<template>
  <div>
    <Button @click="resize">resize</Button>
    <Table :columns="columns10" ref="testTable" :height="600" :data="data9" @on-expand="handleExpand"></Table>
    <!-- <Row>
      <Cell>
        <Table :columns="columns10"
          ref="testTable"
          :height="600"
          :data="data9">
        </Table>
      </Cell>
    </Row>
    <Row>
      <Cell>
        <Button @click="resize" type="primary">resize</Button>
      </Cell>
    </Row>-->
  </div>
</template>

<script>
/* eslint-disable */
import expandTableLevel2 from '@/components/demos/ExpandTableLevel2'
export default {
  name: 'TableExpandDemo',
  components: { expandTableLevel2 },
  data() {
    return {
      columns10: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            let self = this
            return h(expandTableLevel2, {
              props: {
                row: params.row
              },
              on: {
                'resize-handler': function() {
                  console.log('获取到resize事件')
                  // self.$refs.testTable.handleResize()
                  self.$refs.testTable.fixedBody()
                  // self.resize()
                }
              }
            })
          }
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data9: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          job: 'Data engineer',
          interest: 'badminton',
          birthday: '1991-05-14',
          book: 'Steve Jobs',
          movie: 'The Prestige',
          music: 'I Cry'
        },
        {
          name: 'Jim Green',
          age: 25,
          address: 'London No. 1 Lake Park',
          job: 'Data Scientist',
          interest: 'volleyball',
          birthday: '1989-03-18',
          book: 'My Struggle',
          movie: 'Roman Holiday',
          music: 'My Heart Will Go On'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          job: 'Data Product Manager',
          interest: 'tennis',
          birthday: '1992-01-31',
          book: 'Win',
          movie: 'Jobs',
          music: 'Don’t Cry'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          job: 'Data Analyst',
          interest: 'snooker',
          birthday: '1988-7-25',
          book: 'A Dream in Red Mansions',
          movie: 'A Chinese Ghost Story',
          music: 'actor'
        }
      ]
    }
  },
  methods: {
    resize: function() {
      console.log('重置')
      // this.$refs.testTable.fixedBody();
      this.$refs.testTable.fixedBody()
    },
    handleExpand: function() {
      console.log('触发外层展开')
    }
  }
}
</script>
