/**
 * Created by feichongzheng on 17/1/12.
 */
import React, {Component} from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Alert from 'antd/lib/alert';
import 'FayAntd/button/style/index.js';
import 'FayAntd/form/style/index.js';
import 'FayAntd/input/style/index.js';
import 'FayAntd/alert/style/index.js';

import PropTypes from 'prop-types';
import InputNumber from 'antd/lib/input-number';
import 'FayAntd/input-number/style/index.js';
import {connect} from 'react-redux';
import {api} from '../../../resource';
import {actions as resourceStructureActions} from '../../resourceStructure';
import {log} from '../../../../resource';

const FormItem = Form.Item;

class SaveForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            message: '',
            messageType: '',
            showMessage: 'none',
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({loading: true});
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {appId, menuId, refreshTree} = this.props;
                appId && (values.application = {id: appId});
                menuId && (values.menu = {id: menuId});
                const startTime = new Date().getTime();
                api.controllerResource.save(values)
                    .then((res) => res.json())
                    .then((res) => {
                        if (res.success) {
                            const desc = '新增请求资源->【名称：' + values.name + '，标识符：'
                                + values.controllerSn + '，url：' + values.controllerUrlMapping
                                + '，排序号：' + values.controllerOrder + '，所属系统ID' + appId + '，所属菜单ID' + menuId + '】';
                            log.saveAction(api.controllerResource.relativePath.save, desc, new Date().getTime() - startTime, 200);
                            this.setState({
                                showMessage: 'block',
                                message: '保存成功',
                                messageType: 'success',
                                loading: false
                            });
                            refreshTree();
                        } else {
                            this.setState({
                                showMessage: 'block',
                                message: res.errMessage,
                                messageType: 'error',
                                loading: false
                            });
                        }
                    });
            } else {
                this.setState({loading: false});
            }
        });
    };

    handleReset = () => {
        this.setState({showMessage: 'none', message: '', messageType: ''});
        this.props.form.resetFields();
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label="名称">
                    {getFieldDecorator('controllerName', {
                        rules: [{
                            required: true, message: '请输入名称!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem label="标识符">
                    {getFieldDecorator('controllerSn', {
                        rules: [{
                            required: true, message: '请输入标识符!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem label="UrlMapping">
                    {getFieldDecorator('controllerUrlMapping', {
                        rules: [{
                            required: true, message: '请输入UrlMapping!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem label="排序号">
                    {getFieldDecorator('controllerOrder')(
                        <InputNumber min={1} max={100000} style={{width: '100%'}}/>
                    )}
                </FormItem>
                <FormItem>
                    <Alert style={{display: this.state.showMessage}} message={this.state.message}
                           type={this.state.messageType} showIcon/>
                    <Button type="primary" loading={this.state.loading} htmlType="submit" size="default">保存</Button>
                    <Button style={{marginLeft: 8}} onClick={this.handleReset} size="default">
                        重置
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

SaveForm.propTypes = {
    appId: PropTypes.string,
    menuId: PropTypes.string,
    form: PropTypes.object,
    refreshTree: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
    const refreshTree = () => {
        dispatch(resourceStructureActions.findResourceStructureInTree({}, false));
    };
    return {
        refreshTree: refreshTree
    }
};

export default Form.create()(connect(null, mapDispatchToProps)(SaveForm));
