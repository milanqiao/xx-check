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
  let resp =  mock({
      code: 200,
      result,
      message,
      type: 'success',
  });
  console.log()
  if(JSON.stringify(result.params) === '{}') {
    return resp
  } else {
    let target = resp.result.list
    const { userName, prodline, industryLev1, startDate, endDate } = result.params
    if(userName) {
      target = target.filter(item => (item.userName === userName))
    }
    if(prodline) {
      target = target.filter(item => (item.prodline === prodline))
    }
    if(industryLev1) {
      target = target.filter(item => (item.industryLev1 === industryLev1))
    }
    if(startDate && endDate) {
      target = target.filter(item => {
        return new Date(item.createTime).getTime() < new Date(endDate).getTime() && 
               new Date(item.createTime).getTime() > new Date(startDate).getTime()
      })
    }
    return {
      code: 200,
      result: {...result, list: target, pageCount: target.length },
      message,
      type: 'success',
    }
  }
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
          createTime: '@datetime',
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
      let { page, pageSize, ...params } = query
      pageSize = pageSize >= 100 ? 100 : pageSize
      const list = tableList(Number(pageSize))
      return success({
        page: Number(page),
        pageSize: Number(pageSize),
        pageCount: 100,
        params: params || {},
        list,
      });
    }
  }
]