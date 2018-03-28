import React, { Component }  from 'react';
import { connect } from 'react-redux';

import { Table, Button, Icon, Message, Input, Tooltip, Progress } from 'antd';
import { getAppList } from 'Actions/appAction';
import AuthHoc from 'Components/authHoc'
import _ from 'lodash';
import './application.scss';

function mapStateToProps (state) {
  const { apps } = state;
  return {
    apps: apps.data.apps
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getAppList: (namespace) => {
      dispatch(getAppList(namespace))
    }
  }
}


class Application extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: {},
      data: [],
      initLoading: true,
      nameFilter: '',
      filterVisible: false,
      sortInfo: {}
    };
  }

  handleFilter (data, key, val) {
    if (key === 'name') {
      return data.filter(item => {
        return val === '' ? true : item.objectMeta.name.indexOf(val) !== -1;
      });
    }
    return [];
  }

  getAppData (data) {
    data = this.handleFilter(data, 'name', this.state.nameFilter);

    data = data.map((item) => {
      item.key = item.objectMeta.namespace + item.objectMeta.name;
      return item;
    })

    return data;
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.initLoading && !nextProps.isFetching) {
      this.setState({initLoading: false});
    }
    if(!_.isEqual(nextProps.apps, this.props.apps)) {
      this.setState({
        data: this.getAppData(nextProps.apps)
      });
    }
  }

  componentDidMount () {
    this.props.getAppList('kube-system');
    this.interval = setInterval((function () {
      this.props.getAppList('kube-system')
    }).bind(this), 20000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  createApp = () => {
    Message.info('创建应用');
  }

  editApp = () => {
    Message.info('编辑应用');
  }

  handleNameChange = (e) => {
    this.setState({
      nameFilter: e.target.value
    })
  }

  confirmNameFilter = () => {
    this.setState({
      data: this.getAppData(this.props.apps)
    });
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
            value={this.state.nameFilter}
            onChange={this.handleNameChange}
            onPressEnter={this.confirmNameFilter}
          />
          <Button type="primary" onClick={this.confirmNameFilter}>搜索</Button>
        </div>
      ),
      filterDropdownVisible: this.state.filterVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({filterVisible: visible}, () => {
          this.nameSearch && this.nameSearch.focus();
        })
      },
      sorter: (a, b) => a.objectMeta.name > b.objectMeta.name ? 1 : -1,
      sortOrder: this.state.sortInfo.columnKey === 'name' && this.state.sortInfo.order,
      render: (text, record) => {
        let tips = (
          <div>
            <span>类型：{record.typeMeta.kind}</span><br/>
            <span>描述：{record.objectMeta.annotation && record.objectMeta.annotation.description || 'null'}</span>
          </div>
        )
        return (
          <Tooltip placement="right" title={tips} visible={this.state.visible[record.key]} >
            <a href="#">{text}</a>
          </Tooltip>
        )
      }
    },{
      title: 'CPU',
      key: 'cpu',
      render: (text) => {
        return (
          <span>
          { (text.cpuUsage == 0 ? text.cpuUsage : (text.cpuUsage).toFixed(4)) + ' / ' + (text.totalCpu ? text.totalCpu : '无限制') }
          </span>
        )
      }
    },{
      title: 'Memory',
      key: 'memory',
      render: (text) => {
        return (
          <span>
            { (text.memoryUsage == 0 ? text.memoryUsage : (text.memoryUsage).toFixed(4)) + ' / ' + (text.totalMemory ? text.totalMemory : '无限制') }
          </span>
        )
      }
    },{
      title: 'Address',
      key: 'address',
      render: (text, record) => {
        if (record.internalAddr.length === 0) {
          return (
            <span>--</span>
          );
        } else {
          let iAddr = record.internalAddr.map((addr) => (
            <a href={`http://${addr}`} target="_blank" key={`${addr}`}>{`${addr}`}</a>
          ))
          let oAddr = record.nodePort.map((port) => {
            return record.podList.pods.map((pod) => (
              <a href={`http://${pod.podStatus.hostIP}:${port}`} target="_blank" key={`${pod.podStatus.hostIP}-${port}`}>{`${pod.podStatus.hostIP}:${port}`}</a>
            ))
          })
          let tips = (
            <div className="address-tips">
              <span>内部访问：</span>
              {iAddr}
              <span>外部访问：</span>
              {oAddr}
            </div>
          )

          return (
            <span>
              <a href={`http://${record.internalAddr[0]}`} target="_blank">{record.internalAddr[0]}</a>
              {record.internalAddr.length + record.nodePort.length > 1 && <Tooltip placement="right" title={tips}>
                <Icon type="tags" style={{ marginLeft: '10px' }} />
              </Tooltip>}
            </span>
          )
        }
      }
    },{
      title: 'Replicas',
      key: 'replicas',
      render: (text, record) => {
        let percent = 0;
        if (record.pods.desired === 0) {
          percent = 0;
        } else {
          percent = record.statusMap.running * 100 / record.pods.desired
        }
        let tips = (
          <div>
            <div>running: {record.statusMap.running}</div>
            <div>pending: {record.statusMap.pending}</div>
            <div>failed: {record.statusMap.failed}</div>
          </div>
        )
        return (
          <span className="app-status-bar">
            <Tooltip placement="right" title={tips}>
              <Progress successPercent={percent} size="small" status="active" showInfo={false} />
            </Tooltip>
            {record.statusMap.running}/{record.pods.desired}
          </span>
        )
      }
    },{
      title: 'Status',
      key: 'status',
      render: (text, record) => {
        let icon;
        switch (record.runningStatus) {
          case 'running': {
            icon = <Icon type="smile-o" style={{ color: 'green' }} />
            break;
          }
          case 'pending': {
            icon = <Icon type="meh-o" style={{ color: 'yellow' }} />
            break;
          }
          default: {
            icon = <Icon type="frown-o" style={{ color: 'red' }} />
            break;
          }
        }
        return (
          <span>
            {icon}
            <span style={{ marginLeft: '10px' }}>
              {record.runningStatus}
            </span>
          </span>
        )
      }
    },{
      title: 'CreatedAt',
      key: 'createdat',
      sorter: (a, b) => new Date(a.objectMeta.creationTimestamp).getTime() > new Date(b.objectMeta.creationTimestamp).getTime() ? 1 : -1,
      sortOrder: this.state.sortInfo.columnKey === 'createdat' && this.state.sortInfo.order,
      render: (text) => {
        let formattedTime = new Date(text.objectMeta.creationTimestamp).toLocaleString();
        return (
          <span>{formattedTime}</span>
        )
      }
    }]


    return (
      <div className="application-list">
        <div className="toolbar">
          <CreateBtn />
          <EditBtn />
          <DeleteBtn />
        </div>

        <Table
          onRow={(record) => {
            return {
              onMouseOver: () => {
                let initVisible = Object.assign({}, this.state.visible);
                initVisible[record.key] = true;
                this.setState({
                  visible: initVisible
                })
              },
              onMouseLeave: () => {
                let initVisible = Object.assign({}, this.state.visible);
                initVisible[record.key] = false;
                this.setState({
                  visible: initVisible
                })
              }
            }
          }}
          loading={this.state.initLoading}
          dataSource={this.state.data}
          columns={columns}
          onChange={this.handleTableChange}
        />
        
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);