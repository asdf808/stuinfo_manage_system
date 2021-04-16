import {
  Button,
  Menu,
  Layout,
  Row,
  Col,
  Icon,
  Breadcrumb,
  Form,
  Tabs,
  Input,
  Checkbox,
  Alert,
  Dropdown,
  message,
  Avatar,
  Modal,
  Radio,
  Select,
  Table,
  Popconfirm,
  DatePicker,
  Upload,
  Spin,
  Tag,
  Divider,
  Tooltip,
  InputNumber
} from 'ant-design-vue';
export default {
  install(Vue) {
    Vue.use(Button);
    Vue.use(Menu);
    Vue.use(Layout);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Icon);
    Vue.use(Tabs);
    Vue.use(Input);
    Vue.use(Checkbox);
    Vue.use(Alert);
    Vue.use(Avatar);
    Vue.use(Dropdown);
    Vue.use(Form);
    Vue.use(Breadcrumb);
    Vue.use(Modal);
    Vue.use(Radio);
    Vue.use(Select);
    Vue.use(Table);
    Vue.use(Popconfirm);
    Vue.use(DatePicker);
    Vue.use(Upload);
    Vue.use(Spin);
    Vue.use(Tag);
    Vue.use(Divider);
    Vue.use(Tooltip);
    Vue.use(InputNumber);
    Vue.prototype.$message = message;
    Vue.prototype.$confirm = Modal.confirm;
  }
}