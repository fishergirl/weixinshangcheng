import { Route } from 'react-router-dom';
import Redirect from 'umi/redirect';

const invaildRoutes = ['/exchange/goods','/exchange/v2/address','/exchange/v2/goods',];
// const invaildRoutes = [];

export default (args) => {
  const { render, ...rest } = args;
  //rest里可以拿到当前路由路径
  let authorized = true ;
  if(args.location && invaildRoutes.some(item=>item === args.location.pathname)){
    authorized = false
  }
  return <Route
    {...rest}
    render={props =>
      <div>
        {
          authorized ? render(props) : <Redirect to='/404'/>
        }
      </div>
    }
  />;
}
