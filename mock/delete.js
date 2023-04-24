import { mock } from "mockjs";

function success(result, { message = 'ok' } = {}) {
  return mock({
      code: 200,
      result: result.id,
      message,
      type: 'success',
  });
}

export default [
  {
    type:'delete',
    url:'/delete',
    timeout: 1000,
    response: ({ query }) => {
      return success({
        id: query.id
      });
    }
  }
]