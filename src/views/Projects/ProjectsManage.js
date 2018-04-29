import React, { Component } from 'react';
import {
    Col,
    Card,
    Form,
    FormGroup,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    ListGroup,
    ListGroupItem,
    Button,
    ModalFooter,
    Label,
    Tooltip,
    Input,
    Table, Modal, ModalHeader, ModalBody, Badge
} from 'reactstrap';
import { connect } from 'react-redux';
import {
    activeThingAction,
    editProjectAction,
    getProject,
    deleteThingAction,
    getCodecTemplateListAction,
    activateScenarioAction,
    deleteCodecTemplateAction,
    deleteScenarioAction,
    editAliasesAction,
    sendDownlinkAction, DownloadThingsExcelAction,
} from '../../actions/AppActions';
import Spinner from '../Spinner/Spinner';

import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import { style } from 'react-toastify';
import ReactTable from 'react-table'
import Logger from '../../components/Logger';

style({
    colorProgressDefault: 'white'
});

class ProjectsManage extends Component {
    constructor(props) {
        super(props);

        this.toggleABP = this.toggleABP.bind(this)
        this.toggleOTAA = this.toggleOTAA.bind(this)
        this.addThing = this.addThing.bind(this)
        this.addScenario = this.addScenario.bind(this)
        this.dataModalToggle = this.dataModalToggle.bind(this)
        this.renderDownlinkRow = this.renderDownlinkRow.bind(this)
        this.addTemplate = this.addTemplate.bind(this)
        this.uploadExcel = this.uploadExcel.bind(this)
        this.downloadExcel = this.downloadExcel.bind(this)
        this.deleteThingModalToggle = this.deleteThingModalToggle.bind(this)
        this.deleteThing = this.deleteThing.bind(this)
        this.deleteCodec = this.deleteCodec.bind(this)
        this.deleteScenario = this.deleteScenario.bind(this)
        this.manageToastAlerts = this.manageToastAlerts.bind(this)
        this.loadProject = this.loadProject.bind(this)
        this.downLinksAdd = this.downLinksAdd.bind(this)
        this.renderCodecs = this.renderCodecs.bind(this)
        this.deleteCodecModalToggle = this.deleteCodecModalToggle.bind(this)
        this.deleteScenarioModalToggle = this.deleteScenarioModalToggle.bind(this)
        this.deleteAlias = this.deleteAlias.bind(this)
        this.toggle = this.toggle.bind(this);
        this.reactTableColumns = this.reactTableColumns.bind(this);
        this.getAliases = this.getAliases.bind(this);

        this.state = {
            tooltipOpen: [],
            OTAAmodal: false,
            ABPmodel: false,
            id: '',
            project: {},
            dataModal: false,
            modalDownlinkRows: [],
            OTAA: {},
            ABP: {},
            keys: {},
            deleteThingModal: false,
            deleteThingRowId: 0,
            deleteCodecModal: false,
            deleteCodecRowId: 0,
            deleteScenarioModal: false,
            deleteScenarioRowId: 0,
            DownlinkThingRowId: 0,
            newAlias: {key: '', alias: ''}
        };
        this.el_refs = {
            alias: {
                key: '',
                value: '',
            }
        };
        this.nextId = 1;
    }

    downLinksAdd() {
        this.dataModalToggle(0);
        const data = {};
        let json;
        this.state.modalDownlinkRows.forEach((item) => {
            if (item.key && item.value)
                data[item.key] = item.value;
        })
        json = JSON.stringify(data);
        this.props.dispatch(sendDownlinkAction(
            this.state.DownlinkThingRowId,
            {data: json},
            this.callback
        ))
    }

    deleteThing() {
        this.deleteThingModalToggle(0)
        this.props.dispatch(deleteThingAction(
            this.state.project._id,
            this.state.deleteThingRowId,
            this.manageToastAlerts
        ))
    }

    deleteCodec() {
        this.deleteCodecModalToggle(0)
        this.props.dispatch(deleteCodecTemplateAction(
            this.state.project._id,
            this.state.deleteCodecRowId,
            this.manageToastAlerts
        ))
    }

    deleteScenario() {
        this.deleteScenarioModalToggle(0)
        this.props.dispatch(deleteScenarioAction(
            this.state.project._id,
            this.state.deleteScenarioRowId,
            this.manageToastAlerts
        ))
    }

    manageToastAlerts(status, message) {
        if (status === true) {
            // this.deleteThingModalToggle()
            this.loadProject()

            toast('آیتم مورد نظر حذف شد', {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: css({
                    background: '#dbf2e3',
                    color: '#28623c'
                }),
                progressClassName: css({
                    background: '#28623c'
                })
            });
        } else {
            toast(message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: css({
                    background: '#fee2e1',
                    color: '#813838',
                }),
                progressClassName: css({
                    background: '#813838'
                })
            });
        }
    }

    componentWillMount() {
        this.loadProject()
    }

    componentWillReceiveProps(props) {
        const splitedUrl = window.location.href.split('/');
        const me = this;
        if (splitedUrl[splitedUrl.length - 1]) {
            props.projects.forEach((project) => {

                if (project._id === splitedUrl[splitedUrl.length - 1]) {
                    this.setState({
                        project
                    })
                }
            })
        }
    }

    deleteThingModalToggle(id) {
        this.setState({
            deleteThingModal: !this.state.deleteThingModal,
            deleteThingRowId: id
        });
    }

    deleteCodecModalToggle(id) {
        this.setState({
            deleteCodecModal: !this.state.deleteCodecModal,
            deleteCodecRowId: id
        });
    }

    deleteScenarioModalToggle(id) {
        this.setState({
            deleteScenarioModal: !this.state.deleteScenarioModal,
            deleteScenarioRowId: id
        });
    }


    loadProject() {
        const splitedUrl = window.location.href.split('/');
        if (splitedUrl[splitedUrl.length - 1]) {
            this.props.dispatch(getProject(splitedUrl[splitedUrl.length - 1], (status) => {
                if (status)
                    this.props.dispatch(getCodecTemplateListAction(splitedUrl[splitedUrl.length - 1]))
            }))
        }
    }

    render() {
        let aliases = this.state.project.aliases ? this.state.project.aliases : [];
        console.log()
        return (
            <div>
                <Spinner display={this.props.loading}/>
                <ToastContainer className="text-right"/>

                <Modal isOpen={this.state.deleteScenarioModal} toggle={this.deleteScenarioModalToggle}
                       className="text-right">
                    <ModalHeader>حذف سناریو</ModalHeader>
                    <ModalBody>
                        <h3>آیا از حذف سناریو مطمئن هستید ؟</h3>
                        <br/>
                        <h5>پس از حذف امکان برگشت اطلاعات وجود ندارد.</h5>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={() => {
                            this.deleteScenario()
                        }}>حذف</Button>
                        <Button color="danger" onClick={this.deleteScenarioModalToggle}>انصراف</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.deleteCodecModal} toggle={this.deleteCodecModalToggle} className="text-right">
                    <ModalHeader>حذف قالب</ModalHeader>
                    <ModalBody>
                        <h3>آیا از حذف قالب مطمئن هستید ؟</h3>
                        <br/>
                        <h5>پس از حذف امکان برگشت اطلاعات وجود ندارد.</h5>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={() => {
                            this.deleteCodec()
                        }}>حذف</Button>
                        <Button color="danger" onClick={this.deleteCodecModalToggle}>انصراف</Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.deleteThingModal} toggle={this.deleteThingModalToggle} className="text-right">
                    <ModalHeader>حذف شی</ModalHeader>
                    <ModalBody>
                        <h3>آیا از حذف شی مطمئن هستید ؟</h3>
                        <br/>
                        <h5>پس از حذف امکان برگشت اطلاعات وجود ندارد.</h5>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={() => {
                            this.deleteThing()
                        }}>حذف</Button>
                        <Button color="danger" onClick={this.deleteThingModalToggle}>انصراف</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.dataModal} toggle={this.dataModalToggle} className="text-right">
                    <ModalHeader>ارسال داده</ModalHeader>
                    <ModalBody>
                        {this.state.modalDownlinkRows.map(row => this.renderDownlinkRow(row.id, row.key, row.value))}
                        <Button color="success" onClick={() => {
                            this.setState({
                                modalDownlinkRows: [...this.state.modalDownlinkRows, {
                                    id: this.nextId++,
                                    key: '',
                                    value: ''
                                }]
                            })
                        }}>+ اضافه</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={this.downLinksAdd}>ثبت</Button>
                        <Button color="danger" onClick={this.dataModalToggle}>انصراف</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.OTAAmodal} toggle={this.toggleOTAA} className="text-right">
                    <ModalHeader className={'ltr'}>Over-the-Air Activation</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Col sm={9}>
                                    <Input value={this.state.keys['appKey']} onChange={(event) => {
                                        this.setState({
                                            OTTA: {
                                                appKey: event.target.value
                                            }
                                        })
                                    }}
                                           maxLength={32}
                                           placeholder="00AA11BB22CC33DD44FF55GG66HH77JJ"
                                           type="text"/>
                                </Col>
                                <Label sm={3}>Application key</Label>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={() => {
                            this.toggleOTAA()
                            this.props.dispatch(activeThingAction(this.state.OTTA, this.state.selectedThing,
                                this.state.project._id, this.callback))
                        }}>ارسال</Button>
                        <Button color="danger" onClick={this.toggleOTAA}>انصراف</Button>
                    </ModalFooter>
                </Modal>

                <Modal size={'lg'} isOpen={this.state.ABPmodel} toggle={this.toggleABP}
                       className="text-right">
                    <ModalHeader className={'ltr'}>Activation By Personalization</ModalHeader>
                    <ModalBody>
                        <Form className={'english'}>
                            <FormGroup row>
                                <Col sm={7}>
                                    <Input value={this.state.keys['devAddr']} name="devAddr"
                                           onChange={(event) => {
                                               this.setState({
                                                   ABP: {
                                                       ...this.state.ABP,
                                                       [event.target.name]: event.target.value
                                                   }
                                               })
                                           }}
                                           maxLength={32}
                                           placeholder="66HH77JJ"
                                           type="text"/>
                                </Col>
                                <Label sm={5}>Device Address:</Label>
                            </FormGroup>

                            <FormGroup row>
                                <Col sm={7}>
                                    <Input value={this.state.keys['appSKey']} name="appSKey"
                                           onChange={(event) => {
                                               this.setState({
                                                   ABP: {
                                                       ...this.state.ABP,
                                                       [event.target.name]: event.target.value
                                                   }
                                               })
                                           }}
                                           maxLength={32}
                                           placeholder="44FF55GG66HH77JJ00AA11BB22CC33DD"
                                           type="text"/>
                                </Col>
                                <Label sm={5}>Application Session Key:</Label>
                            </FormGroup>

                            <FormGroup row>
                                <Col sm={7}>
                                    <Input value={this.state.keys['nwkSKey']} name="nwkSKey"
                                           onChange={(event) => {
                                               this.setState({
                                                   ABP: {
                                                       ...this.state.ABP,
                                                       [event.target.name]: event.target.value
                                                   }
                                               })
                                           }}
                                           maxLength={32}
                                           placeholder="00AA11BB22CC33DD44FF55GG66HH77JJ"
                                           type="text"/>
                                </Col>
                                <Label sm={5}>Network Session Key:</Label>
                            </FormGroup>
                            <FormGroup row>
                                <Col sm={7}>
                                    <Input value={this.state.keys['fCntDown']} name="fCntDown"
                                           onChange={(event) => {
                                               this.setState({
                                                   ABP: {
                                                       ...this.state.ABP,
                                                       [event.target.name]: event.target.value
                                                   }
                                               })
                                           }}
                                           placeholder="12"
                                           type="text"/>
                                </Col>
                                <Label sm={5}>Downlink Frame Counter:</Label>
                            </FormGroup>
                            <FormGroup row>
                                <Col sm={7}>
                                    <Input value={this.state.keys['fCntUp']} name="fCntUp"
                                           onChange={(event) => {
                                               this.setState({
                                                   ABP: {
                                                       ...this.state.ABP,
                                                       [event.target.name]: event.target.value
                                                   }
                                               })
                                           }}
                                           placeholder="12"
                                           type="text"/>
                                </Col>
                                <Label sm={5}>Downlink Frame Counter : </Label>
                            </FormGroup>

                            <FormGroup row>
                                <Col sm={7}>
                                    <Input value={this.state.keys['skipFCntCheck']} name="skipFCntCheck"
                                           onChange={(event) => {
                                               this.setState({
                                                   ABP: {
                                                       ...this.state.ABP,
                                                       [event.target.name]: event.target.value ? 1 : 0
                                                   }
                                               })
                                           }} type="checkbox"/>
                                </Col>
                                <Label sm={5}>Disable Frame Counter Validation:</Label>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={() => {
                            this.toggleABP()
                            this.props.dispatch(activeThingAction(this.state.ABP,
                                this.state.selectedThing, this.state.project._id, this.callback))
                        }}>ارسال</Button>
                        <Button color="danger" onClick={this.toggleABP}>انصراف</Button>
                    </ModalFooter>
                </Modal>

                <div className="row">
                    <div className="col-md-12 col-lg-6">
                        <Card className="text-justify">
                            <CardHeader>
                                <CardTitle className="mb-0 font-weight-bold h6">تغییر اطلاعات پروژه</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <FormGroup style={{display: 'flex'}}>
                                        <div style={{minWidth: '65px', width: '20%'}}>
                                            <Label>نام پروژه:</Label>
                                        </div>
                                        <div style={{width: '80%'}}>
                                            <Input type="text" onChange={(event) => {
                                                this.setState({
                                                    project: {
                                                        ...this.state.project,
                                                        name: event.target.value
                                                    }
                                                })
                                            }} maxLength="50" value={this.state.project.name || ''}/>
                                        </div>
                                    </FormGroup>
                                    <FormGroup style={{display: 'flex'}}>
                                        <div style={{minWidth: '65px', width: '20%'}}>
                                            <Label>توضیحات:</Label>
                                        </div>
                                        <div style={{width: '80%'}}>
                                            <Input value={this.state.project.description || ''} onChange={(event) => {
                                                this.setState({
                                                    project: {
                                                        ...this.state.project,
                                                        description: event.target.value
                                                    }
                                                })
                                            }} maxLength="150" type="textarea" name="" rows="2"/>
                                        </div>
                                    </FormGroup>

                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button onClick={() => {
                                    this.props.dispatch(editProjectAction(this.state.project._id, {
                                        name: this.state.project.name,
                                        description: this.state.project.description
                                    }))
                                }} color="primary">ثبت اطلاعات</Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="col-md-12 col-lg-6">
                        <Card className="text-justify">
                            <CardHeader>
                                <CardTitle className="mb-0 font-weight-bold h6">نام مستعار کلید داده‌ها</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    data={this.getAliases()}
                                    columns={this.reactTableColumns('aliases')}
                                    showPageSizeOptions={false}
                                    nextText='بعدی'
                                    previousText='قبلی'
                                    rowsText='ردیف'
                                    pageText='صفحه'
                                    ofText='از'
                                    minRows='1'
                                    noDataText='یافت نشد'
                                    resizable={false}
                                    defaultPageSize={3}
                                    className="-striped -highlight"
                                />
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <td><input ref={input => this.el_refs.alias.key = input}
                                                   onChange={(event) => {
                                                       this.setState({
                                                           newAlias: {
                                                               ...this.state.newAlias,
                                                               key: event.target.value
                                                           }
                                                       })
                                                   }}
                                                   type="text" className="form-control" placeholder={'مقدار اصلی'}/>
                                        </td>
                                        <td><input ref={input => this.el_refs.alias.value = input}
                                                   onChange={(event) => {
                                                       this.setState({
                                                           newAlias: {
                                                               ...this.state.newAlias,
                                                               alias: event.target.value
                                                           }
                                                       })
                                                   }} type="text" className="form-control"
                                                   placeholder={'نام مستعار'}/>
                                        </td>
                                        <td>
                                            <button onClick={() => {
                                                const newAlias = this.state.newAlias;
                                                if (!newAlias.key || !newAlias.alias) {
                                                    toast('اطلاعات را کامل وارد کنید', {
                                                        position: toast.POSITION.BOTTOM_LEFT,
                                                        className: css({
                                                            background: '#fee2e1',
                                                            color: '#813838',
                                                        }),
                                                    });
                                                    return;
                                                }
                                                this.setState({
                                                    project: {
                                                        ...this.state.project,
                                                        aliases: {
                                                            ...this.state.project.aliases,
                                                            [newAlias.key]: newAlias.alias
                                                        }
                                                    }
                                                })
                                                this.el_refs.alias.key.value = '';
                                                this.el_refs.alias.value.value = '';

                                            }} type="button" className="btn btn-primary">اضافه کردن
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </CardBody>
                            <CardFooter>
                                <Button onClick={() => {
                                    this.props.dispatch(editAliasesAction(this.state.project._id, {
                                        aliases: JSON.stringify(this.state.project.aliases)
                                    }))
                                }} color="primary">ثبت</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                <Card className="text-justify">
                    <CardHeader>
                        <CardTitle className="mb-0 font-weight-bold h6">اشیا متصل شده به پروژه</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            data={this.state.project.things}
                            columns={this.reactTableColumns('things')}
                            pageSizeOptions={[10, 15, 25]}
                            nextText='بعدی'
                            previousText='قبلی'
                            filterable={true}
                            rowsText='ردیف'
                            pageText='صفحه'
                            ofText='از'
                            minRows='1'
                            noDataText='شی‌ای وجود ندارد'
                            resizable={false}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </CardBody>
                    <CardFooter>
                        <Button onClick={this.addThing} className="ml-1" color="primary">افزودن شی</Button>
                        <Button onClick={this.uploadExcel} className="ml-1" color="success">افزودن دسته ای شی</Button>
                        <Button onClick={this.downloadExcel} className="ml-1" color="success">خروجی اکسل</Button>
                    </CardFooter>
                </Card>

                <Card className="text-justify">
                    <CardHeader>
                        <CardTitle className="mb-0 font-weight-bold h6">انتخاب سناریو پروژه</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            data={this.state.project.scenarios}
                            columns={this.reactTableColumns('scenarios')}
                            pageSizeOptions={[10, 15, 25]}
                            nextText='بعدی'
                            previousText='قبلی'
                            filterable={true}
                            rowsText='ردیف'
                            pageText='صفحه'
                            ofText='از'
                            minRows='1'
                            noDataText='سناریویی وجود ندارد'
                            resizable={false}
                            defaultPageSize={10}
                            className="-striped -highlight"
                            getTrProps={(state, rowInfo) => {
                                if (rowInfo && rowInfo.original.is_active)
                                    return {
                                        style: {
                                            background: '#20a8d8',
                                            color: '#fff'
                                        }
                                    };
                                else
                                    return {}
                            }}
                        />
                    </CardBody>
                    <CardFooter>
                        <Button onClick={this.addScenario} color="primary">افزودن سناریو</Button>
                    </CardFooter>
                </Card>


                <Card className="text-justify">
                    <CardHeader>
                        <CardTitle className="mb-0 font-weight-bold h6">لیست قالب های codec</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            data={this.state.project.templates}
                            columns={this.reactTableColumns('codecs')}
                            pageSizeOptions={[10, 15, 25]}
                            nextText='بعدی'
                            previousText='قبلی'
                            filterable={true}
                            rowsText='ردیف'
                            pageText='صفحه'
                            ofText='از'
                            minRows='1'
                            noDataText='قالبی وجود ندارد'
                            resizable={false}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </CardBody>
                    <CardFooter>
                        <Button onClick={this.addTemplate} color="primary">افزودن قالب</Button>
                    </CardFooter>
                </Card>

                <Logger project={this.state.project._id}/>
            </div>
        );
    }

    toggle(key) {
        let tooltipOpen = this.state.tooltipOpen;
        tooltipOpen[key] = tooltipOpen[key] === undefined || !tooltipOpen[key]
        this.setState({
            tooltipOpen
        });
    }

    getAliases() {
        let aliases = this.state.project.aliases ? this.state.project.aliases : [];
        return Object.keys(aliases).map((key) => {
            return {value: aliases[key], key: key}
        })
    }

    renderDownlinkRow(id, key, value) {
        return (
            <FormGroup row key={id}>
                <Col sm={5}>
                    <Input type="text" value={key} onChange={(e) => {
                        const newRows = [...this.state.modalDownlinkRows];
                        const item = newRows.findIndex(item => item.id == id)
                        newRows[item].key = e.target.value;
                        this.setState({modalDownlinkRows: newRows})
                    }} placeholder="کلید"/>
                </Col>
                <Col sm={5}>
                    <Input type="text" value={value} onChange={(e) => {
                        const newRows = [...this.state.modalDownlinkRows];
                        const item = newRows.findIndex(item => item.id == id)
                        newRows[item].value = e.target.value;
                        this.setState({modalDownlinkRows: newRows})
                    }} placeholder="مقدار"/>
                </Col>
                <Col sm={2} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Button color="danger" onClick={() => {
                        this.setState({
                            modalDownlinkRows: this.state.modalDownlinkRows.filter((value) => value.id != id)
                        })
                    }} className="btn-sm" style={{float: 'left'}}>&times;</Button>
                </Col>
            </FormGroup>
        )

    }

    deleteAlias(event) {
        const key = event.target.value;
        const newState = {
            project: {
                ...this.state.project,
                aliases: {
                    ...this.state.project.aliases,
                }
            }
        };
        delete newState.project.aliases[key];
        this.setState(newState)
    }

    dataModalToggle(id) {
        this.setState({
            dataModal: !this.state.dataModal,
            modalDownlinkRows: [],
            DownlinkThingRowId: id
        });
    }

    uploadExcel() {
        window.location = `#/things/excel/${this.state.project._id}`
    }

    downloadExcel() {
        this.props.dispatch(DownloadThingsExcelAction(this.state.project._id))
    }

    addThing() {
        window.location = `#/things/${this.state.project._id}/new`
    }

    addScenario() {
        window.location = `#/scenario/${this.state.project._id}/new`
    }

    toggleOTAA() {
        this.setState({
            OTAAmodal: !this.state.OTAAmodal
        });
    }

    toggleABP() {
        this.setState({
            ABPmodel: !this.state.ABPmodel
        });
    }


    callback(status, message) {
        if (!status)
            toast(message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: css({
                    background: '#fee2e1',
                    color: '#813838',
                }),
                progressClassName: css({
                    background: '#813838'
                })
            });
        else
            toast('با موفقیت انجام شد', {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: css({
                    background: '#dbf2e3',
                    color: '#28623c'
                }),
                progressClassName: css({
                    background: '#28623c'
                })
            });
    }


    renderCodecs() {
        if (this.state.project.templates)
            return (this.state.project.templates.map((template, key) => {
                return (this.renderTemplateItem(template, key))
            }))
    }

    addTemplate() {
        window.location = `#/template/${this.state.project._id}/new`
    }

    reactTableColumns(type) {
        switch (type) {
            case 'things':
                return [
                    {
                        Header: 'نام شی',
                        accessor: 'name',
                        maxWidth: 200
                    },
                    {
                        Header: 'آدرس',
                        accessor: 'interface.devEUI',
                        filterMethod: (filter, row) =>
                            row[filter.id].startsWith(filter.value) ||
                            row[filter.id].endsWith(filter.value),
                        maxWidth: 200
                    },
                    {
                        Header: 'نوع',
                        accessor: 'type',
                        filterMethod: (filter, row) => row[filter.id].startsWith(filter.value.toUpperCase()),
                        maxWidth: 100
                    },
                    {
                        id: 'rowTools',
                        Header: 'امکانات',
                        filterable: false,
                        accessor: row => {
                            let badgeColor = 'success'
                            switch (row.last_seen_at.status) {
                                case 'gray':
                                    badgeColor = 'secondary'
                            }
                            return (<div>
                                <Button className="ml-1" onClick={() => {
                                    row.type === 'ABP' ? this.toggleABP() : this.toggleOTAA()
                                    this.setState({
                                        selectedThing: row._id,
                                        keys: row.keys
                                    })
                                }} color="success" size="sm">فعال سازی</Button>
                                <Button onClick={() => {
                                    window.location = `#/things/${this.state.project._id}/${row._id}`
                                }} className="ml-1" color="warning" size="sm">ویرایش</Button>
                                <Button onClick={() => {
                                    window.location = `#/codec/${this.state.project._id}/${row._id}`
                                }} className="ml-1" color="secondary" size="sm">ارسال codec</Button>
                                <Button onClick={() => this.dataModalToggle(row._id)} className="ml-1" color="primary"
                                        size="sm">ارسال داده (داون لینک)</Button>
                                <Button onClick={() => this.deleteThingModalToggle(row._id)} className="ml-1"
                                        color="danger"
                                        size="sm">حذف شئ</Button>
                                <Badge id={`key-${row._id}`} color={badgeColor}>وضعیت </Badge>
                                <Tooltip placement="top" isOpen={this.state.tooltipOpen[row._id]}
                                         target={`key-${row._id}`}
                                         toggle={() => this.toggle(row._id)}>
                                    {row.last_seen_at.time}
                                </Tooltip>
                            </div>);
                        }
                    },
                ]
            case 'scenarios':
                return [
                    {
                        Header: 'عنوان',
                        accessor: 'name',
                        maxWidth: 200,
                        style: {
                            display: 'flex',
                            alignItems: 'center'
                        }

                    },
                    {
                        id: 'rowTools',
                        Header: 'امکانات',
                        filterable: false,
                        accessor: row => <div>
                            <Button onClick={() => this.deleteScenarioModalToggle(row._id)}
                                    className="ml-1 float-left" color="danger" size="sm">حذف</Button>
                            <Button className="ml-1 float-left" onClick={() => {
                                window.location = `#/scenario/${this.state.project._id}/${row._id}`
                            }} color="warning" size="sm">ویرایش</Button>
                            <Button onClick={() => {
                                this.props.dispatch(activateScenarioAction(this.state.project._id, row._id))
                            }} disabled={row.is_active} className="ml-1 float-left" color="success"
                                    size="sm">فعالسازی</Button>
                        </div>
                    },
                ];
            case 'codecs':
                return [
                    {
                        Header: 'عنوان',
                        accessor: 'name',
                        maxWidth: 200,
                        style: {
                            display: 'flex',
                            alignItems: 'center'
                        }
                    },
                    {
                        id: 'rowTools',
                        Header: 'امکانات',
                        filterable: false,
                        accessor: row => <div>
                            <Button onClick={() => this.deleteCodecModalToggle(row._id)}
                                    className="ml-1 float-left" color="danger" size="sm">حذف</Button>
                            <Button onClick={() => {
                                window.location = `#/template/${this.state.project._id}/${row._id}`
                            }} className="ml-1 float-left" color="warning" size="sm">ویرایش</Button>
                        </div>
                    },
                ]
            case 'aliases':
                return [
                    {
                        Header: 'مقدار اصلی',
                        accessor: 'key',
                        maxWidth: 200
                    },
                    {
                        Header: 'نام مستعار',
                        accessor: 'value',
                    },
                    {
                        id: 'operations',
                        Header: 'حذف',
                        accessor: (row) => <Button color="danger" onClick={this.deleteAlias} value={row.key}
                                                   className="btn-sm" style={{float: 'left'}}>&times;</Button>,
                        style: {
                            display: 'flex',
                            justifyContent: 'center'
                        }
                    }
                ]
        }

    }


}

function mapStateToProps(state) {
    return {
        projects: state.projectReducer,
        loading: state.homeReducer.currentlySending
    };
}


export default connect(mapStateToProps)(ProjectsManage);
