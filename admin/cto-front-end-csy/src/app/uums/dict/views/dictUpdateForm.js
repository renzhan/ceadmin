/**
 * Created by feichongzheng on 17/1/12.
 */
import React, {Component} from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Alert from 'antd/lib/alert';
import InputNumber from 'antd/lib/input-number';
import 'FayAntd/button/style/index.js';
import 'FayAntd/form/style/index.js';
import 'FayAntd/input/style/index.js';
import 'FayAntd/alert/style/index.js';
import 'FayAntd/input-number/style/index.js';

import PropTypes from 'prop-types';
import {api} from '../../resource';

import {log} from '../../../resource';
import {DictTypeSelect} from '../../dictType';

const {update} = api.dict;
const FormItem = Form.Item;
class UpdateForm extends Component {

    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            passwordDirty: false,
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
                values.id = this.props.data.id;
                const startTime = new Date().getTime();
                update(values).then((res) => res.json())
                    .then((res) => {
                        if (res.success) {
                            const desc = '更新数据字典->【ID：'+values.id+'，序号：'+values.serial+'，编码：'
                                +values.code+'，名称：'+values.value+'，类型：'+values.type.id+'】';
                            log.saveAction(api.dict.relativePath.update, desc, new Date().getTime()-startTime, 200);
                            this.setState({showMessage: 'block', message: '保存成功', messageType: 'success', loading: false});
                            const {setModal, cb} = this.props;
                            setModal(false);
                            cb();
                        } else {
                            this.setState({showMessage: 'block', message: res.errMessage, messageType: 'error', loading: false});
                        }
                    })
                    .catch( (err) => {
                        throw err;
                    });
            } else {
                this.setState({ loading: false});
            }
        });
    };

    handleReset = () => {
        this.setState({showMessage: 'none', message: '', messageType: ''});
        this.props.form.resetFields();
    };

    render () {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 6,
            },
        };
        const data = this.props.data;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="序号">
                    {getFieldDecorator('serial', {
                        rules: [{
                            required: true, message: '请输入序号!',
                        }],
                        initialValue: data.serial,
                    })(
                        <InputNumber min={1} max={100000000} style={{width: '100%'}}/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="编码">
                    {getFieldDecorator('code', {
                        rules: [{
                            required: true, message: '请输入编码!',
                        }],
                        initialValue: data.code,
                    })(
                        <InputNumber min={1} max={100000000} style={{width: '100%'}}/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="名称">
                    {getFieldDecorator('value', {
                        rules: [{
                            required: true, message: '请输入名称!',
                        }],
                        initialValue: data.value,
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="类型">
                    {getFieldDecorator('type.id', {
                        initialValue: data.typeId,
                    })(
                        <DictTypeSelect showSearch allowClear placeholder="请选择类型"/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Alert style={{display: this.state.showMessage}} message={this.state.message} type={this.state.messageType} showIcon/>
                    <Button type="primary" loading={this.state.loading} htmlType="submit" size="default">保存</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset} size="default">
                        重置
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

UpdateForm.propTypes = {
    data: PropTypes.object,
    form: PropTypes.object,
    cb: PropTypes.func,
    setModal: PropTypes.func,
};

export default Form.create()(UpdateForm);