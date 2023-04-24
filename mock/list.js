import {Random, mock} from 'mockjs'

Random.extend({
  userName: function() {
    let surName = ['任','乔','江','李','孙','林','王']
    let name = ['勇','志','磊','秦','强','岚']
    return `${this.pick(surName)}${this.pick(name)}`
  },
  prodLine: function() {
    let prodLine = ['产品线1','产品线2','产品线3']
    return this.pick(prodLine)
  },
  industry: function() {
    let industry = ['行业1','行业2','行业3']
    return this.pick(industry)
  },
  webSite: function() {
    let webSite = ['com','cn','net']
    return `www.${Random.word(3, 9)}.${this.pick(webSite)}`
  },
  userType: function() {
    let userType = ['普通','高级','会员']
    return this.pick(userType)
  },
  naturalEwt: function() {
    let naturalEwt = ['大陆企业单位','大陆事业单位','海外企业单位']
    return this.pick(naturalEwt)
  },
})

// 包装返回的数据
function success(result, { message = 'ok' } = {}) {
  return mock({
      code: 200,
      result,
      message,
      type: 'success',
  });
}

function makeMock(times, callback) {
  let i = -1;
  while (++i < times) {
      callback(i);
  }
}

const tableList = (pageSize) => {
  const result = [];
  makeMock(pageSize, () => {
      result.push({
          id: '@integer(10,999999)',
          userName: '@USERNAME',
          prodline: '@PRODLINE',
          industryLev1: '@INDUSTRY',
          industryLev2: '@INDUSTRY',
          beginTime: '@datetime',
          endTime: '@datetime',
          webSite: '@WEBSITE',
          userType: '@USERTYPE',
          naturalEwt: '@NATURALEWT',
          remark: '@cparagraph(1, 2)',
          dataList: ({
              "data|1-10": [
                {
                  "taskId": '@integer(10,999999)',
                  "title": '@cparagraph(1)',
                  "desc": '@cparagraph(1, 2)',
                  "pics|1-3": [
                    `@image("80x80", "${Random.color()}", "${Random.color()}", "${Random.first()}")`
                  ],
                }
              ]
            }
          ),
          resultPage: Random.image('240x400', Random.color(), Random.color(), Random.first()),
          avatar: Random.image('400x400', Random.color(), Random.color(), Random.first()),
          date: `@date('yyyy-MM-dd')`
      });
  });
  return result;
};
export default [
  {
    type:'get',
    url:'/getlist',
    timeout: 1000,
    response: ({ query }) => {
      let { page, pageSize } = query
      pageSize = pageSize >= 100 ? 100 : pageSize
      const list = tableList(Number(pageSize))
      return success({
        page: Number(page),
        pageSize: Number(pageSize),
        pageCount: 100,
        list,
      });
    }
  }
]