import React, { Component }  from 'react';
import { connect } from 'react-redux';

import { Table, Button, Icon, Message, Input } from 'antd';
import { getAppList } from 'Actions/appAction';
import AuthHoc from 'Components/authHoc'

function mapStateToProps (state) {
  const { apps } = state;
  return {
    apps
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getAppList: () => {
      dispatch(getAppList())
    }
  }
}


class Application extends Component {
  constructor (props) {
    super(props);
    this.state = {
      nameSearchVal: '',
      filterVisible: false,
      sortInfo: {}
    };
  }

  componentDidMount () {
    this.props.getAppList();
  }

  createApp = () => {
    Message.info('创建应用');
  }

  editApp = () => {
    Message.info('编辑应用');
  }

  handleNameSearch = (e) => {
    this.setState({
      nameSearchVal: e.target.value
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      sortInfo: sorter
    })
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

    const columns = [{
      title: 'Name',
      dataIndex: 'objectMeta.name',
      key: 'name',
      filterDropdown: (
        <div className="table-filter-dropdown">
          <Input
            ref={ele => this.nameSearch = ele}
            placeholder="搜索应用"
            value={this.state.nameSearchVal}
            onChange={this.handleNameSearch}
          />
        </div>
      ),
      filterDropdownVisible: this.state.filterVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({filterVisible: visible}, () => {
          this.nameSearch && this.nameSearch.focus();
        })
      },
      sorter: (a, b) => a.objectMeta.name > b.objectMeta.name,
      sortOrder: this.state.sortInfo.columnKey === 'name' && this.state.sortInfo.order,
      render: text => <a href="">{text}</a>
    },{
      title: 'Type',
      key: 'type',
      dataIndex: 'typeMeta.kind'
    },{
      title: 'CreatedAt',
      key: 'createdat',
      sorter: (a, b) => a.objectMeta.creationTimestamp > b.objectMeta.creationTimestamp,
      sortOrder: this.state.sortInfo.columnKey === 'createdat' && this.state.sortInfo.order,
      dataIndex: 'objectMeta.creationTimestamp'
    }]

    let data = this.props.apps.data.deploymentList.deployments.filter(item => {
      return this.state.nameSearchVal === '' ? true : item.objectMeta.name.indexOf(this.state.nameSearchVal) !== -1;
    });

    data = data.map((item, idx) => {
      item.key = idx;
      return item;
    })

    return (
      <div className="application-list">
        <div className="toolbar">
          <CreateBtn />
          <EditBtn />
          <DeleteBtn />
        </div>

        <Table
          loading={this.props.apps.isFetching}
          dataSource={data}
          columns={columns}
          onChange={this.handleTableChange}
        />
        
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);