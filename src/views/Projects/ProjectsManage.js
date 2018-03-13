import React, {Component} from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Badge,
    FormGroup,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    ListGroup,
    ListGroupItem,
    Button,
    ButtonGroup,
    ModalFooter,
    Label,
    Input,
    Table, Modal, ModalHeader, ModalBody
} from 'reactstrap';
import {connect} from 'react-redux';
import {activeThingAction, editProjectAction, getProject, deleteThingAction} from "../../actions/AppActions";
import Spinner from "../Spinner/Spinner";

import {ToastContainer, toast} from 'react-toastify';
import {css} from 'glamor';
import {style} from "react-toastify";

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
        this.modalAddable = this.modalAddable.bind(this)
        this.uploadExcel = this.uploadExcel.bind(this)
        this.deleteThingModalToggle = this.deleteThingModalToggle.bind(this)
        this.deleteThing = this.deleteThing.bind(this)
        this.manageToastAlerts = this.manageToastAlerts.bind(this)
        this.loadProject = this.loadProject.bind(this)

        this.state = {
            OTAAmodal: false,
            ABPmodel: false,
            id: "",
            project: {},
            dataModal: false,
            modalAddableItems: [],
            OTAA: {},
            ABP: {},
            deleteThingModal: false,
            deleteThingRowId: 0
        }
    }

    deleteThing() {
        this.props.dispatch(deleteThingAction(
            this.state.project._id,
            this.state.deleteThingRowId,
            this.manageToastAlerts
        ))
    }

    manageToastAlerts(status) {
        if(status === true) {
            this.deleteThingModalToggle()
            this.loadProject()

            toast('شی مورد نظر حذف شد', {
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
            toast(status, {
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
                    console.log('findddd', project)
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

    loadProject() {
        const splitedUrl = window.location.href.split('/');
        if (splitedUrl[splitedUrl.length - 1]) {
            this.props.dispatch(getProject(splitedUrl[splitedUrl.length - 1]))
        }
    }

    render() {
        return (
            <div>
                <Spinner display={this.props.loading}/>
                <ToastContainer className="text-right"/>

                <Modal isOpen={this.state.deleteThingModal} toggle={this.deleteThingModalToggle} className="text-right">
                    <ModalHeader>حذف شی</ModalHeader>
                    <ModalBody>
                        <h3>آیا از حذف شی مطمئن هستید ؟</h3>
                        <br />
                        <h5>پس از حذف امکان برگشت اطلاعات وجود ندارد.</h5>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={() => {
                            this.deleteThing(this.state.deleteRowId)
                        }}>حذف</Button>
                        <Button color="danger" onClick={this.deleteThingModalToggle}>انصراف</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.dataModal} toggle={this.dataModalToggle} className="text-right">
                    <ModalHeader>ارسال داده</ModalHeader>
                    <ModalBody>
                        {this.state.modalAddableItems}
                        <Button color="success" onClick={this.modalAddable}>+ اضافه</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={this.dataModalToggle}>ثبت</Button>
                        <Button color="danger" onClick={this.dataModalToggle}>انصراف</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.OTAAmodal} toggle={this.toggleOTAA} className="text-right">
                    <ModalHeader>OTAA</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Label sm={3}> appKey : </Label>
                                <Col sm={9}>
                                    <Input onChange={(event) => {
                                        this.setState({
                                            OTTA: {
                                                appKey: event.target.value
                                            }
                                        })
                                    }} type="text"/>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="ml-1" onClick={() => {
                            this.toggleOTAA()
                            this.props.dispatch(activeThingAction(this.state.OTTA, this.state.selectedThing,
                                this.state.project._id, this.callback))
                        }}>ارسال</Button>
                        <Button color="danger" onClick={this.toggle}>انصراف</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.ABPmodel} toggle={this.toggleABP} className="text-right">
                    <ModalHeader>ABP</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Label sm={3}>appSKey : </Label>
                                <Col sm={9}>
                                    <Input name="appSKey"
                                           onChange={(event) => {
                                               let state = {}
                                               state[event.target.name] = event.target.value
                                               this.setState({
                                                   ABP: {
                                                       ...this.setState.ABP,
                                                   }
                                               })
                                           }} type="text"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={3}>devAddr : </Label>
                                <Col sm={9}>
                                    <Input name="devAddr"
                                           onChange={(event) => {
                                               let state = {}
                                               state[event.target.name] = event.target.value
                                               this.setState({
                                                   ABP: {
                                                       ...this.setState.ABP,
                                                   }
                                               })
                                           }} type="text"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={3}>fCntDown : </Label>
                                <Col sm={9}>
                                    <Input name="fCntDown"
                                           onChange={(event) => {
                                               let state = {}
                                               state[event.target.name] = event.target.value
                                               this.setState({
                                                   ABP: {
                                                       ...this.setState.ABP,
                                                   }
                                               })
                                           }} type="text"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={3}>fCntUp : </Label>
                                <Col sm={9}>
                                    <Input name="fCntUp"
                                           onChange={(event) => {
                                               let state = {}
                                               state[event.target.name] = event.target.value
                                               this.setState({
                                                   ABP: {
                                                       ...this.setState.ABP,
                                                   }
                                               })
                                           }} type="text"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={3}>nwkSKey : </Label>
                                <Col sm={9}>
                                    <Input name="nwkSKey"
                                           onChange={(event) => {
                                               let state = {}
                                               state[event.target.name] = event.target.value
                                               this.setState({
                                                   ABP: {
                                                       ...this.setState.ABP,
                                                   }
                                               })
                                           }} type="text"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={3}>skipFCntCheck : </Label>
                                <Col sm={9}>
                                    <Input name="skipFCntCheck"
                                           onChange={(event) => {
                                               let state = {}
                                               state[event.target.name] = event.target.value
                                               this.setState({
                                                   ABP: {
                                                       ...this.setState.ABP,
                                                       ...state
                                                   }
                                               })
                                           }} type="text"/>
                                </Col>
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

                <Card className="text-justify">
                    <CardHeader>
                        <CardTitle className="mb-0 font-weight-bold h6">تغییر اطلاعات پروژه</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form>
                            <FormGroup row>
                                <Label sm={2}>نام پروژه : </Label>
                                <Col sm={5}>
                                    <Input type="text" onChange={(event) => {
                                        this.setState({
                                            project: {
                                                ...this.state.project,
                                                name: event.target.value
                                            }
                                        })
                                    }} value={this.state.project.name}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={2}>توضیحات :‌ </Label>
                                <Col sm={5}>
                                    <Input value={this.state.project.description} onChange={(event) => {
                                        this.setState({
                                            project: {
                                                ...this.state.project,
                                                description: event.target.value
                                            }
                                        })
                                    }} type="textarea" name="" rows="2"/>
                                </Col>
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

                <Card className="text-justify">
                    <CardHeader>
                        <CardTitle className="mb-0 font-weight-bold h6">اشیا متصل شده به پروژه</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Table hover responsive className="table-outline">
                            <thead className="thead-light">
                            <tr>
                                <th>#</th>
                                <th>نام شی</th>
                                <th>آدرس</th>
                                <th>نوع</th>
                                <th>امکانات</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.project.things !== undefined ?
                                    this.state.project.things.map((thing, key) => {
                                        return (this.renderThingItem(thing, key))
                                    }) :
                                    <br/>
                            }
                            </tbody>
                        </Table>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={this.addThing} className="ml-1" color="primary">افزودن شی</Button>
                        <Button onClick={this.uploadExcel} className="ml-1" color="success">افزودن دسته ای شی</Button>
                    </CardFooter>
                </Card>

                <Card className="text-justify">
                    <CardHeader>
                        <CardTitle className="mb-0 font-weight-bold h6">انتخاب سناریو پروژه</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ListGroup className="p-0">
                            {
                                this.state.project.scenario !== undefined ? this.renderScenarioItem() : <br/>
                            }
                        </ListGroup>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={this.addScenario} color="primary">افزودن سناریو</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }


    renderScenarioItem() {
        return (
            <ListGroupItem className="justify-content-between">
                {this.state.project.scenario.name}
                <Button className="ml-1 float-left" color="warning" size="sm">ویرایش</Button>
                <Button className="ml-1 float-left" color="success" size="sm">نمایش</Button>
            </ListGroupItem>
        )
    }

    renderThingItem(thing, key) {
        return (
            <tr id={key}>
                <th>{key + 1}</th>
                <td>{thing.name}</td>
                <td>{thing.interface.devEUI}</td>
                <td>{thing.type}</td>
                <td>
                    <Button className="ml-1" onClick={() => {
                        thing.type === 'ABP' ? this.toggleABP() : this.toggleOTAA()
                        this.setState({
                            selectedThing: thing._id
                        })
                    }}
                            color="success" size="sm">فعال سازی</Button>
                    <Button className="ml-1" color="warning" size="sm">ویرایش</Button>
                    <Button onClick={this.dataModalToggle} className="ml-1" color="primary" size="sm">ارسال
                        داده</Button>
                    <Button onClick={() => this.deleteThingModalToggle(thing._id)} className="ml-1" color="danger"
                        size="sm">حذف</Button>
                </td>
            </tr>
        )
    }


    dataModalToggle() {
        this.setState({
            dataModal: !this.state.dataModal
        });
    }

    uploadExcel() {
        window.location = `#/things/excel/${this.state.project._id}`
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

    modalAddable() {
        let newItem = (
            <FormGroup row>
                <Col sm={5}>
                    <Input type="text" placeholder="کلید"/>
                </Col>
                <Col sm={1} className="text-center"> : </Col>
                <Col sm={5}>
                    <Input type="text" placeholder="مقدار"/>
                </Col>
            </FormGroup>
        )

        this.setState(prevState => ({
            modalAddableItems: [...prevState.modalAddableItems, newItem]
        }))
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
            toast('ف با موفقیت انجام شد', {
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

}

function mapStateToProps(state) {
    return {
        projects: state.projectReducer,
        loading: state.homeReducer.currentlySending
    };
}


export default connect(mapStateToProps)(ProjectsManage);
