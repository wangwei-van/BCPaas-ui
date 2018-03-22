import React from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';

import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { loginUser } from 'Actions/authAction';
import './login.scss';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitHandle({
          username: this.props.form.getFieldValue('userName'),
          password: this.props.form.getFieldValue('password')
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>
          {this.props.auth.isFetching ? (
            <Button type="primary" className="login-form-button">
              Logging...
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          )}
          Or <a href="">register now!</a>
        </FormItem>
      </Form>
    );
  }
}



function mapStateToProps (state) {
  const {auth} = state;
  return {
    auth
  }
}

function mapDispatchToProps (dispatch) {
  return {
    submitHandle: (credential) => {
      dispatch(loginUser(credential))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LoginForm));