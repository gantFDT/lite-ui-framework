import { default as RenderAuthorize } from '@/components/common/authorized';
import { getAuthority } from './authority';
let Authorized = RenderAuthorize(getAuthority()); // eslint-disable-line
// Reload the rights component

const reloadAuthorized = () => {
  Authorized = RenderAuthorize(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
