import React, { Component }  from 'react';

import { Button, Icon, Message } from 'antd';
import AuthHoc from 'Components/authHoc'

class Application extends Component {
  createApp = () => {
    Message.info('创建应用');
  }

  editApp = () => {
    Message.info('编辑应用');
  }

  render () {
    const CreateBtn = AuthHoc(
      <Button className="primary" onClick={this.createApp}><Icon type="plus" />创建应用</Button>,
      'APP-CREATE'
    );
    const EditBtn = AuthHoc(
      <Button onClick={this.editApp}><Icon type="edit" />编辑应用</Button>,
      'APP-EDIT'
    );
    const DeleteBtn = AuthHoc(
      <Button><Icon type="delete" />删除应用</Button>,
      'APP-DELETE'
    );

    return (
      <div>
        <CreateBtn />
        <br/>
        <EditBtn />
        <br/>
        <DeleteBtn />
        <br/>
        应用
      </div>
    )
  }
}

export default Application;