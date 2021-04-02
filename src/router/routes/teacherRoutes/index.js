import stuInfo from './stuInfo';
import score from './score';
import personal from './personal';
export default {
  path: 'teacher',
  meta: {
    auth: 'teacher'
  },
  component: () => import('@/layouts/BlankView.vue'),
  children: [stuInfo, score, personal]
};
