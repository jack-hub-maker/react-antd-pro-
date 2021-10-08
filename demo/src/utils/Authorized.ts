/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: xingyingjie
 * @Date: 2021-10-08 11:16:33
 * @LastEditors: xingyingjie
 * @LastEditTime: 2021-10-08 11:22:31
 */
import RenderAuthorize from '@/components/Authorized';
import { getAuthority } from './authority';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
let Authorized = RenderAuthorize(getAuthority());

// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthority());
};

/** Hard code block need it。 */
window.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;
