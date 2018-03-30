import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

import { Table, Button, Icon, Message, Input, Tooltip, Progress } from 'antd';
import { getAppList } from 'Actions/appAction';
import AuthHoc from 'Components/authHoc';
import './application.scss';

function mapStateToProps (state) {
  const { apps, home } = state;
  return {
    apps: apps.data.apps,
    namespace: home.namespace
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getAppList: (namespace) => {
      dispatch(getAppList(namespace))
    }
  }
}

/* 将过滤和分页信息保存在当前state中，方便下一级路由跳转回来时保持之前的状态 */

class Application extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: {}, /* 某条记录类型、描述tooltip显示 */
      data: [],
      initLoading: true,
      filterInfo: {
        name: {
          value: '',
          visible: false
        }
      },
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true
      },
      sortInfo: {}
    };
  }

  handleFilter (data, key, val) {
    if (key === 'name') {
      return data.filter(item => {
        return !val ? true : item.objectMeta.name.indexOf(val) !== -1;
      });
    }
    return [];
  }

  getAppData (data) {
    data = this.handleFilter(data, 'name', this.state.filterInfo.name.value);

    data = data.map((item) => {
      item.key = item.objectMeta.namespace + item.objectMeta.name;
      return item;
    })

    return data;
  }

  startPool = (namespace) => {
    this.props.getAppList(namespace);
    this.interval = setInterval((function () {
      this.props.getAppList(namespace)
    }).bind(this), 20000);
  }

  stopPool = () => {
    clearInterval(this.interval);
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.initLoading && !nextProps.isFetching) {
      this.setState({initLoading: false});
    }
    
    if (!_.isEqual(nextProps.namespace, this.props.namespace)) {
      this.setState({initLoading: true});
      const { namespace } = nextProps;
      this.stopPool();
      this.startPool(namespace);
    }

    /**
     * TODO: lodash.isEqual好像不能判断嵌套对象是否相等，需要考虑其他方法
     */
    if(!_.isEqual(nextProps.apps, this.props.apps)) {
      this.setState({
        data: this.getAppData(nextProps.apps)
      });
    }
  }

  componentDidMount () {
    const { namespace } = this.props;
    this.startPool(namespace);
  }

  componentWillUnmount () {
    this.stopPool();
  }

  createApp = () => {
    Message.info('创建应用');
  }

  editApp = () => {
    Message.info('编辑应用');
  }

  handleNameChange = (e) => {
    var filterInfo = Object.assign({}, this.state.filterInfo, {
      name: {
        value: e.target.value
      }
    })
    this.setState({
      filterInfo
    })
  }

  confirmNameFilter = () => {
    this.setState({
      data: this.getAppData(this.props.apps)
    });
  }

  showDesc = (key) => {
    let initVisible = Object.assign({}, this.state.visible);
    initVisible[key] = true;
    this.setState({
      visible: initVisible
    })
  }

  hideDesc = (key) => {
    let initVisible = Object.assign({}, this.state.visible);
    initVisible[key] = false;
    this.setState({
      visible: initVisible
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination: pagination,
      sortInfo: sorter
    })
  }

  render () {
    const HocBtn = AuthHoc(Button);

    const columns = [{
      title: 'Name',
      dataIndex: 'objectMeta.name',
      key: 'name',
      filterDropdown: (
        <div className="table-filter-dropdown">
          <Input
            ref={ele => this.nameSearch = ele}
            placeholder="搜索应用"
            value={this.state.filterInfo.name.value}
            onChange={this.handleNameChange}
            onPressEnter={this.confirmNameFilter}
          />
          <Button type="primary" onClick={this.confirmNameFilter}>搜索</Button>
        </div>
      ),
      filterDropdownVisible: this.state.filterInfo.name.visible,
      onFilterDropdownVisibleChange: (visible) => {
        var filterInfo = Object.assign({}, this.state.filterInfo, {
          name: {
            visible
          }
        });
        this.setState({filterInfo}, () => {
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
            <Link to={`/appManage/application/${text}`} onClick={this.hideDesc.bind(this, record.key)} >{text}</Link>
          </Tooltip>
        )
      }
    },{
      title: 'CPU',
      dataIndex: 'cpuUsage',
      key: 'cpu',
      render: (text, record) => {
        return (
          <span>
          { (text == 0 ? text : (text).toFixed(4)) + ' / ' + (record.totalCpu ? record.totalCpu : '无限制') }
          </span>
        )
      }
    },{
      title: 'Memory',
      dataIndex: 'memoryUsage',
      key: 'memory',
      render: (text, record) => {
        return (
          <span>
            { (text == 0 ? text : (text).toFixed(4)) + ' / ' + (record.totalMemory ? record.totalMemory : '无限制') }
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
      dataIndex: 'runningStatus',
      key: 'status',
      render: (text) => {
        let icon;
        switch (text) {
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
              {text}
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

    if (this.props.children) {
      return (
        <React.Fragment>
        {this.props.children}
        </React.Fragment>
      )
    }

    return (
      <div className="application-list">
        <div className="toolbar">
          <HocBtn className="primary" onClick={this.createApp} auth={4}><Icon type="plus" />创建应用</HocBtn>
          <HocBtn className="primary" onClick={this.editApp} auth={8}><Icon type="edit" />编辑应用</HocBtn>
          <HocBtn className="primary" auth={7}><Icon type="delete" />删除应用</HocBtn>
        </div>

        <Table
          onRow={(record) => {
            return {
              onMouseOver: () => this.showDesc(record.key),
              onMouseLeave: () => this.hideDesc(record.key)
            }
          }}
          loading={this.state.initLoading}
          dataSource={this.state.data}
          columns={columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);