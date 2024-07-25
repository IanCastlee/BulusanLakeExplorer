import "./comment.scss";
import pp from "../../assets/hckr.webp";

const Comment = ({ closeComment }) => {
  return (
    <>
      <div className="right">
        <div className="top2">
          <div className="top">
            <span>Eyhan's post</span>
            <i class="bi bi-x-lg" onClick={closeComment}></i>
            {/* <i class="bi bi-x-square-fill"></i> */}
          </div>
        </div>
        <div className="comments">
          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>

          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>

          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                </p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>

          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                </p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>

          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                </p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>

          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                </p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>

          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                </p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>

          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                </p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>
          <div className="card">
            <div className="pp-name-review">
              <img src={pp} alt="" />
              <div className="name-review">
                <span>Name</span>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                </p>
              </div>
            </div>
            <div className="bot">
              <p>2 mins ago</p>
              <span>more</span>
            </div>
          </div>
        </div>

        <div className="input">
          <textarea name="" placeholder="Share your comment"></textarea>
          <i class="bi bi-file-arrow-up-fill"></i>
        </div>
      </div>
      <div className="overlay-comment" onClick={closeComment}></div>
    </>
  );
};

export default Comment;
