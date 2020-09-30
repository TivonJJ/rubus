/* eslint-disable */
import React  from 'react';
import PropTypes from 'prop-types';
import { Alert, Popover } from 'antd';
import { CloseCircleOutlined, LoadingOutlined, ReloadOutlined, RightOutlined, SafetyOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { debounce } from 'lodash';
import styles from './index.less';

const hasTouch = 'ontouchstart' in window;

// 登录滑块图片验证
export default class Slide2Verify extends React.Component {
    static propTypes = {
        onFetch: PropTypes.func.isRequired,
        onCheck: PropTypes.func.isRequired,
        wrapperWidth: PropTypes.any, // 容器宽度
        xGutter: PropTypes.number, // x轴图块的起始间距
        prefetch: PropTypes.bool,// 预加载图片
        delayResetOnError: PropTypes.number,// 错误时显示错误状态自动恢复初始状态并重新加载的延迟
        delayActiveOnFocus: PropTypes.number,// 鼠标放上去弹出图片延迟时间
    };

    static defaultProps = {
        wrapperWidth: 'auto',
        xGutter: 3,
        prefetch: true,
        delayResetOnError: 500,
        delayActiveOnFocus: hasTouch?0:300,
    };

    state = {
        wrapperWidth: 320,
        wrapperHeight: 200,
        sliderImage: null,
        error: null,
        popoverVisible: false,
        status: 'default',
    };

    constructor(props){
        super(props);
        this.onResize = debounce(this.onResize,500);
    }

    componentDidMount() {
        if (this.props.prefetch) {
            this.loadImage();
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    initialWithWrapperSize=()=>{
        const width = this.props.wrapperWidth === 'auto' ? this.wrapper.clientWidth : this.props.wrapperWidth;
        this.setState({ wrapperWidth: width });
    };

    destroy=()=> {
        window.removeEventListener('resize',this.onResize);
        this.wrapper.removeEventListener('mouseenter',this.showPopup);
        this.wrapper.removeEventListener('mouseleave',this.hidePopup);
    };

    onResize=()=>{
        this.reset();
    };

    reset=()=> {
        this.setState({ status: 'default' });
        this.initialWithWrapperSize();
        this.slideImage&&this.slideImage.reset();
        this.slideBar&&this.slideBar.reset();
        this.hidePopup();
        this.loadImage();
    };

    handleWrapperMount = (ref) => {
        if (!ref || this.wrapper) return;
        this.wrapper = ref;
        this.initialWithWrapperSize();
        supportTouchEvents(this.wrapper);
        this.wrapper.addEventListener('mouseenter',this.showPopup);
        this.wrapper.addEventListener('mouseleave',this.hidePopup);
        window.addEventListener('resize',this.onResize);
    };

    loadImage = () => {
        this.setState({ sliderImage: null, error: null, status: 'fetch' });
        const { onFetch } = this.props;
        const rs = onFetch();
        const resolveImage = (src) => {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.src = src;
                image.onload = (() => {
                    resolve(image);
                });
                image.onerror = (e) => {
                    reject(e);
                };
            });
        };
        rs.then(data => {
            Promise.all([resolveImage(data.bg), resolveImage(data.slider)]).then(res => {
                const bg = res[0];
                    const slider = res[1];
                const ratio = this.state.wrapperWidth / bg.width;
                bg.viewWidth = this.state.wrapperWidth;
                bg.viewHeight = bg.height * ratio;
                slider.viewWidth = slider.width * ratio;
                slider.viewHeight = slider.height * ratio;
                slider.viewY = data.y * ratio;
                data.bg = bg;
                data.slider = slider;
                this.setState({
                    wrapperHeight: bg.viewHeight,
                    sliderImage: {
                        ...data,
                        ratio,
                    },
                    status: 'ready',
                });
            },err=>{
                this.setState({ error: err.message,status:'error' });
            });
        }, err => {
            this.setState({ error: err.message,status:'error' });
        });
    };

    handleSlideStart = () => {
        this.setState({ status: 'drag' });
    };

    handleSlideMove = (x) => {
        this.slideImage&&this.slideImage.move(x);
    };

    handleSlideEnd = (x) => {
        const reverseRatio = this.state.sliderImage.bg.width / this.state.wrapperWidth;
        const realX = Math.round(x * reverseRatio) - this.props.xGutter;
        const promise = this.props.onCheck({ x: realX, moveX: x, key: this.state.sliderImage.key });
        this.setState({ status: 'verify' });
        promise.then((data) => {
            this.setState({ status: 'success' });
            this.props.onSuccess && this.props.onSuccess(data);
        }, (err) => {
            this.setState({ status: 'failed' });
            setTimeout(() => {
                this.reset();
                this.props.onFail && this.props.onFail(err);
            }, this.props.delayResetOnError);
        });
    };

    showPopup = () => {
        // 延迟显示，避免在表单元素之间造成闪烁
        this.waiteActive = true;
        setTimeout(()=>{
            if (this.state.status === 'success' || !this.waiteActive) return;
            this.setState({ popoverVisible: true });
            if (!this.state.sliderImage && this.state.status !== 'fetch') {
                this.loadImage();
            }
        },this.props.delayActiveOnFocus)

    };

    hidePopup = () => {
        this.waiteActive = false;
        if(this.state.status==='drag')return;
        this.setState({ popoverVisible: false });
    };

    render() {
        const { className, sliderClass, xGutter, disabled } = this.props;
        const { wrapperWidth, wrapperHeight, sliderImage, status, error, popoverVisible } = this.state;
        return (
            <Popover
                overlayClassName={styles.imagePopover}
                overlayStyle={{ width: wrapperWidth, height: wrapperHeight }}
                getPopupContainer={() => this.wrapper}
                visible={popoverVisible}
                content={
                    <SlideImage wrapperWidth={wrapperWidth}
                                onReload={this.loadImage}
                                image={sliderImage}
                                xGutter={xGutter}
                                fetching={status === 'fetch'}
                                ref={ref => this.slideImage = ref}
                                error={error}/>
                }>
                <div ref={this.handleWrapperMount} className={classnames(styles.slideWrapper, className,
                    {[styles.disabled]:disabled})}>
                    <div className={classnames(styles.slidebar, sliderClass, `status-${status}`)}>
                        <SlideBar wrapperWidth={wrapperWidth}
                                  status={status}
                                  disabled={disabled}
                                  ref={ref => this.slideBar = ref}
                            // active={this.showPopup}
                            // deactive={this.hidePopup}
                                  onSlideStart={this.handleSlideStart}
                                  onSlideMove={this.handleSlideMove}
                                  onSlideEnd={this.handleSlideEnd}/>
                    </div>
                </div>
            </Popover>
        );
    }
}

class SlideBar extends React.Component {
    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        window.removeEventListener('mousemove', this.watchMove);
        window.removeEventListener('mouseup', this.watchEnd);
        this.slider.removeEventListener('mousedown', this.watchStart);
        // this.slider.removeEventListener('mouseenter',this.handleActive);
        // this.slider.removeEventListener('mouseleave', this.handleDeactive);
    }

    startX = 0;

    moveX = 0;

    watchStart = (evt) => {
        if(this.props.disabled)return;
        if (this.props.status !== 'ready') return;
        this.props.onSlideStart(evt);
        this.startX = evt.clientX;
        window.addEventListener('mousemove', this.watchMove);
        window.addEventListener('mouseup', this.watchEnd);
    };

    watchMove = (evt) => {
        if (this.props.status !== 'drag') return;
        const moveX = evt.clientX - this.startX;
        if (moveX >= 0 && moveX <= this.props.wrapperWidth - this.slider.clientWidth) {
            this.slider.style.left = `${moveX  }px`;
            this.cover.style.width = `${moveX  }px`;
            this.moveX = moveX;
            this.props.onSlideMove(moveX);
        }
    };

    watchEnd = () => {
        window.removeEventListener('mousemove', this.watchMove);
        window.removeEventListener('mouseup', this.watchEnd);
        this.props.onSlideEnd(this.moveX);
    };

    // handleActive=()=>{
    //     if(this.props.disabled)return;
    //     this.props.active();
    // };
    // handleDeactive=()=>{
    //     if(this.props.disabled)return;
    //     this.props.deactive();
    // };
    onSliderMount = (ref) => {
        if (!ref) return;
        this.slider = ref;
        supportTouchEvents(ref);
        // this.slider.addEventListener('mouseenter',this.handleActive);
        // this.slider.addEventListener('mouseleave', this.handleDeactive);
        this.slider.addEventListener('mousedown', this.watchStart);
    };

    reset = () => {
        this.startX = 0;
        this.moveX = 0;
        this.slider.style.left = 0;
        this.cover.style.width = 0;
        window.removeEventListener('mousemove', this.watchMove);
        window.removeEventListener('mouseup', this.watchEnd);
    };

    render() {
        const {  status } = this.props;
        const icon = {
            success: <SafetyOutlined />,
            failed: <CloseCircleOutlined />,
            verify: <LoadingOutlined />,
        }[status] || <RightOutlined />;
        let msg = {
            fetch: '加载中...',
            ready: '向右拖动滑块填充拼图'
        }[status];
        return (
            <>
                <div className={styles.sliderCover} ref={ref => this.cover = ref}/>
                <div className={classnames(styles.slideButton)}
                     ref={this.onSliderMount}>
                    {icon}
                </div>
                <div className={styles.message}>{msg}</div>
            </>
        );
    }
}

class SlideImage extends React.Component {
    move = (x) => {
        if(!this.sliderImage)return;
        this.sliderImage.style.left = `${Math.max(this.props.xGutter, x)  }px`;
    };

    reset = () => {
        if(!this.sliderImage)return;
        this.sliderImage.style.left = `${this.props.xGutter  }px`;
    };

    render() {
        const { image, error, fetching } = this.props;
        return (
            <div className={styles.imageWrapper}>
                <label className={styles.reloadButton} onClick={this.props.onReload}>
                    <ReloadOutlined style={{ color: '#fff' }} />
                </label>
                {error && <Alert className={styles.content} message={error} type="error"/>}
                {fetching ? <div className={styles.content}>
                    <LoadingOutlined style={{ fontSize: 23 }}/>
                </div> : image && <>
                    <img className={styles.bg} src={image.bg.src} style={{
                        width: image.bg.viewWidth,
                        height: image.bg.viewHeight,
                    }}/>
                    <img className={styles.slider} src={image.slider.src}
                         ref={ref => this.sliderImage = ref}
                         style={{
                             width: image.slider.viewWidth,
                             height: image.slider.viewHeight,
                             top: image.slider.viewY,
                             left: this.props.xGutter,
                         }}/>
                </>}
            </div>
        );
    }
}

// 兼容移动设备
function supportTouchEvents(element) {
    element.addEventListener('touchstart', touchHandler, true);
    element.addEventListener('touchmove', touchHandler, true);
    element.addEventListener('touchend', touchHandler, true);
    element.addEventListener('touchcancel', touchHandler, true);
}

function touchHandler(event) {
    const touches = event.changedTouches;
        const first = touches[0];
        let types = [];
    switch (event.type) {
        case 'touchstart':
            types = ['mousedown','mouseenter'];
            break;
        case 'touchmove':
            types = ['mousemove','mouseover'];
            break;
        case 'touchend':
            types = ['mouseup','mouseleave'];
            break;
        default:
            return;
    }
    types.map(type=>{
        const simulatedEvent = document.createEvent('MouseEvent');
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
            first.screenX, first.screenY,
            first.clientX, first.clientY, false,
            false, false, false, 0/* left */, null);

        first.target.dispatchEvent(simulatedEvent);
    });
    event.preventDefault();
}
