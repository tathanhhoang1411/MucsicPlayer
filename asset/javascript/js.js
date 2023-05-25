const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd')

const playList = $('.playlist')

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');

const playBtn = $('.btn-toggle-play');
const player = $('.player')


const progress = $('.progress')

const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')

const randomBtn = $('.btn-random')

const repeatBtn = $('.btn-repeat')


const app = {
    currentIndex: 0,//chỉ mục đầu tiên của mảng
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "HOL'UP",
            singer: "KENDRICK LAMMAR",
            path: './asset/song/music/song1.mp3',
            image: 'https://plus.unsplash.com/premium_photo-1683121324549-84fc1d876464?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
        },
        {
            name: "UNSTOPVERBLE",
            singer: "ICD",
            path: './asset/song/music/song2.mp3',
            image: 'https://images.unsplash.com/photo-1684777621486-6a00aaf5df32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
        },
        {
            name: "MOTTO",
            singer: "NF",
            path: './asset/song/music/song3.mp3',
            image: 'https://images.unsplash.com/photo-1684770683649-9b2d74fa5554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
        },
        {
            name: "LET ME DOWN",
            singer: "NF",
            path: './asset/song/music/song4.mp3',
            image: 'https://plus.unsplash.com/premium_photo-1678115323020-27c62b5dcb61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
        },
        {
            name: "COUT ME OUT",
            singer: "KENDRICK LAMMAR",
            path: './asset/song/music/song5.mp3',
            image: 'https://images.unsplash.com/photo-1684243841385-18c29dd5ab29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
        },
        {
            name: "SILENT HILL",
            singer: "KENDRICK LAMMAR F.t BABY KEEM",
            path: './asset/song/music/song6.mp3',
            image: 'https://plus.unsplash.com/premium_photo-1675826725982-e8508781c558?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        }

    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {//this.songs từng bài hát sẽ được lặp qua và đặt tên là song
            return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `
        })//${index === this.currentIndex ? 'active' : ''} tác dụng thêm class active vào 
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {// hãy tìm hiểu defineProperty
            get: function () {
                return this.songs[this.currentIndex]//trả về bài hát đầu tiên trong mảng
            }
        })
    },
    handleEvents: function () {//tất cả sự kiện thực hiện tại đây
        const cdWidth = cd.offsetWidth;
        const _this = this

        //xử lý cd quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }//cho cd quay 360 độ
        ]
            , {
                duration: 10000,// quay trong 10s
                iterations: Infinity//só lần quay: vô hạng
            })
        cdThumbAnimate.pause();
        //khi giảm chiều rộng của cd, chiều dài giảm theo
        //lấy chiều rộng của cd playconsole
        //bắt sự kiện người dùng kéo lên xuống playlist
        document.onscroll = function () {//khi scroll
            //xác định vị trí trên trục y || tương tự nhưng thích hợp trên nhiều trình duyệt
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;
            //gán chiều rộng cho cd=> cd nhỏ dần khi kéo xuống cuối list nhạc
            //nhưng khi kéo nhanh quá sẽ có lúc không cd không ẩn hoàn toàn
            //vì không bắt được sk scroll về 0
            if (newCdWidth > 0) {
                cd.style.width = newCdWidth + 'px';
            }
            else {
                //nếu newCdWidth bé hơn 0 thì cho cd chiều rộng bằng 0
                cd.style.width = 0;
            }
            cd.style.opacity = newCdWidth / cdWidth;// làm mờ ảnh cd khi kéo
        }

        //Xuử lý khi click play

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
            //khi song được play
            audio.onplay = function () {
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play();

            }
            //khi song được pause
            audio.onpause = function () {
                _this.isPlaying = false;
                player.classList.remove("playing");
                cdThumbAnimate.pause();
            },

                //khi tiến trình bvaif hát thay đổi
                audio.ontimeupdate = function () {
                    if (audio.duration) {
                        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                        progress.value = progressPercent;
                    }
                },
                //Xử lý khi tua songs
                progress.oninput = function (e) {
                    const seekTime = audio.duration / 100 * e.target.value;
                    audio.currentTime = seekTime;
                },
                //khi next song
                nextBtn.onclick = function () {
                    if (_this.isRandom) {
                        _this.playRandomSong()
                    } else {
                        _this.nextSong();
                    }
                    audio.play();
                    _this.render();
                    _this.scrollActiveSong();
                },
                //khi prev song
                prevBtn.onclick = function () {
                    if (_this.isRandom) {//nếu true : nghĩa là randomBtn đucojw bật
                        _this.playRandomSong()
                    } else {
                        _this.prevSong();
                    }
                    audio.play();
                    _this.render();
                    _this.scrollActiveSong();
                }
            //xử lý khi  bấm bật tắt  random songs
            randomBtn.onclick = function () {
                _this.isRandom = !_this.isRandom//nếu  _this.isRandom!=false (_this.isRandom đã gán ở trên)
                this.classList.toggle('active', _this.isRandom)
            }
            //xử lý next song khi hêts bài
            audio.onended = function () {
                if (_this.isRepeat) {
                    audio.play();
                } else {
                    nextBtn.click();//gắn sự kiện click khi hết song
                }
            }
            //xử lý khi  bấm bật tắt  repeat songs
            repeatBtn.onclick = function () {
                _this.isRepeat = !_this.isRepeat;//nếu  _this.isRepeat!=false (_this.isRepeat đã gán ở trên)
                this.classList.toggle('active', _this.isRepeat)
            }

        }
        //lắng nghe sự kiện click list nhạc(viết bên ngoài hàng của 
        //playBtn để nó render hết tất cả các song nếu sau này được thêm vào)
        playList.onclick = function (e) {
            //lắng nghe sự kiện click list nhạc
            const songNote = e.target.closest('.song:not(.active)')//không chứa class active
            if (songNote || e.target.closest('.option')) {// chứa class option
                if (songNote) {// xử lí khi click vào song
                    _this.currentIndex = Number(songNote.dataset.index) //dataset khi đã có attribute data-index line 73
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                if (e.target.closest('.option')) {
                    console.log("comming son!! UPDATE")
                }
            }

        }
    },
    scrollActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    loadCurrentSong: function () {//nhiệm vụ load thông tin bài hát

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path

    },
    nextSong: function () {
        this.currentIndex++;

        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;//để vị trí bài hát hiện tại có  giá trị random

        this.loadCurrentSong();
    },

    start: function () {
        //lắng nghe và xử lý các sự kiện(DOM Event)
        this.handleEvents();
        // dịnh nghĩa các thuộc tính cho Object
        this.defineProperties();
        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        //Render playlist
        this.render();
    },


}

app.start();