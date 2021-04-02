import stuInfo from './stuInfo';
import score from './score';
import personal from './personal';
import user from './user';
export default {
  path: 'admin',
  meta: {
    auth: 'admin',
    root: true
  },
  component: () => import('@/layouts/BlankView.vue'),
  children: [stuInfo, score, user, personal]
};
