import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [state, setstate] = useState({
    1: {
      type: -1,
      value: null,
      children: [],
    },
  });
  const [count, setcount] = useState(1);
  const [result, setResult] = useState(undefined);
  const [argument, setArgument] = useState([
    { name: "My Arg", value: 0, _id: 1 },
  ]);
  // in case of arg, value in the state is the id of the arg. get real value by going in argument state and find that value
  const addNewArg = () => {
    setArgument((prev) => {
      return [...prev, { name: "My Arg", value: 0, _id: prev.length + 1 }];
    });
  };
  const handleArgNameChange = (id, value) => {
    setArgument((prev) => {
      let newObj = prev.map((obj) => {
        if (obj._id == id) {
          obj.name = value;
        }
        return obj;
      });
      return [...newObj];
    });
  };
  const handleArgValueChange = (id, value) => {
    setArgument((prev) => {
      let newObj = prev.map((obj) => {
        if (obj._id == id) {
          obj.value = parseInt(value);
        }
        return obj;
      });
      return [...newObj];
    });
  };
  const handleChange = (id, val) => {
    if (val === "and") {
      setstate((prev) => {
        let obj = prev[id];
        if (!obj.children.includes(count + 1)) obj.children.push(count + 1);
        if (!obj.children.includes(count + 2)) obj.children.push(count + 2);
        obj.type = "and";
        return {
          ...prev,
          [id]: obj,
          [count + 1]: {
            type: -1,
            value: null,
            children: [],
          },
          [count + 2]: {
            type: -1,
            value: null,
            children: [],
          },
        };
      });

      setcount((prev) => prev + 2);
    } else if (val === "or") {
      setstate((prev) => {
        let obj = prev[id];
        if (!obj.children.includes(count + 1)) obj.children.push(count + 1);
        if (!obj.children.includes(count + 2)) obj.children.push(count + 2);
        obj.type = "or";
        return {
          ...prev,
          [id]: obj,
          [count + 1]: {
            type: -1,
            value: null,
            children: [],
          },
          [count + 2]: {
            type: -1,
            value: null,
            children: [],
          },
        };
      });

      setcount((prev) => prev + 2);
    } else if (val === "constant") {
      setstate((prev) => {
        let obj = state[id];
        obj.type = "constant";
        obj.value = 0;
        return {
          ...prev,
          [id]: obj,
        };
      });
      setcount((prev) => prev);
    } else if (val == "arg") {
      setstate((prev) => {
        let obj = state[id];
        obj.type = "arg";
        obj.value = 1;
        return {
          ...prev,
          [id]: obj,
        };
      });

      setcount((prev) => prev);
    }
  };

  const handleArgChange = (id, newVal) => {
    setstate((prev) => {
      let obj = state[id];
      obj.value = newVal;
      return {
        ...prev,
        [id]: obj,
      };
    });
  };

  const handleConstChange = (id, newVal) => {
    setstate((prev) => {
      let obj = state[id];
      obj.value = parseInt(newVal);
      return {
        ...prev,
        [id]: obj,
      };
    });
  };
  const handleNewChildren = (id) => {
    setstate((prev) => {
      let obj = prev[id];
      if (!obj.children.includes(count + 1)) obj.children.push(count + 1);
      return {
        ...prev,
        [id]: obj,
        [count + 1]: {
          type: -1,
          value: null,
          children: [],
        },
      };
    });

    setcount((prev) => prev + 1);
  };
  const handleTypeChange = (id, newVal) => {
    setstate((prev) => {
      let obj = state[id];
      obj.type = newVal;
      return {
        ...prev,
        [id]: obj,
      };
    });
  };

  const handleDeleteChilds = (id) => {
    let obj = state[id];
    for (let i = 0; i < obj.children.length; i++) {
      handleDeleteChilds(obj.children[i]);
    }
    setstate((prev) => {
      let newobj = { ...prev };
      delete newobj[id];
      return { ...newobj };
    });
  };
  const handleDelete = (id) => {
    let obj = state[id];
    handleDeleteChilds(id);
    setstate((prev) => {
      return { ...prev, [id]: { type: -1, value: null, children: [] } };
    });
  };
  function view(id) {
    let obj = state[id];

    let returnNode = (
      <>
        <div style={{ marginLeft: "1rem" }}>
          {obj?.type == -1 ? (
            <select
              value={obj.type}
              onChange={(e) => {
                let newVal = e.target.value;
                handleChange(id, newVal);
              }}
            >
              <option value="-1" selected>
                Select
              </option>
              <option value="constant">Const</option>
              <option value="arg">Argument</option>
              <option value="and">And</option>
              <option value="or">Or</option>
            </select>
          ) : obj?.type == "constant" ? (
            <select
              value={obj.value}
              onChange={(e) => {
                let newVal = e.target.value;
                handleConstChange(id, newVal);
              }}
            >
              <option value={0} selected>
                False
              </option>
              <option value={1}>True</option>
            </select>
          ) : obj?.type == "arg" ? (
            <select
              onChange={(e) => {
                let newVal = e.target.value;
                handleArgChange(id, newVal);
              }}
            >
              {argument.map((argObj) => (
                <option key={argObj._id} value={argObj._id}>
                  {argObj.name}
                </option>
              ))}
            </select>
          ) : obj?.type == "and" ? (
            <select
              onChange={(e) => {
                let newVal = e.target.value;
                handleTypeChange(id, newVal);
              }}
            >
              <option value="or">Or</option>
              <option value="and" selected>
                And
              </option>
            </select>
          ) : (
            <select
              onChange={(e) => {
                let newVal = e.target.value;
                // handleArgChange(id, newVal);\
                handleTypeChange(id, newVal);
              }}
            >
              <option value="or" selected>
                Or
              </option>
              <option value="and">And</option>
            </select>
          )}
          <button
            style={{ marginLeft: "1rem" }}
            onClick={() => handleDelete(id)}
          >
            X
          </button>
          {obj?.children.length > 0 ? (
            <>
              {obj.children.map((cid) => view(cid))}
              <button onClick={() => handleNewChildren(id)}>Add Op</button>
            </>
          ) : null}
        </div>
      </>
    );
    return returnNode;
  }
  function recur(id) {
    if (state[id].type === "constant") {
      return state[id].value;
    } else if (state[id].type == "arg") {
      let argId = state[id].value;
      let temp = argument.filter((doc) => doc._id == argId)[0];
      return temp.value;
    } else if (state[id].type === "and") {
      let ans = 1;
      for (let i = 0; i < state[id].children.length; i++) {
        ans = ans && recur(state[id].children[i]);
      }

      return ans;
    } else {
      let ans = 0;
      for (let i = 0; i < state[id].children.length; i++) {
        ans = ans || recur(state[id].children[i]);
      }

      return ans;
    }
  }
  useEffect(() => {
    let ans = recur(1);
    setResult(Boolean(ans));
  }, [state, argument]);

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        {argument.map((obj) => (
          <div key={obj?._id}>
            <input
              type="text"
              value={obj?.name}
              onChange={(e) => {
                let newName = e.target.value;
                handleArgNameChange(obj?._id, newName);
              }}
            />
            <select
              value={obj?.value}
              onChange={(e) => {
                let newVal = e.target.value;
                handleArgValueChange(obj._id, newVal);
              }}
            >
              <option value={0}>false</option>
              <option value={1}>true</option>
            </select>
          </div>
        ))}
        <div>
          <button onClick={addNewArg}>Add Arg</button>
        </div>
      </div>
      {view(1)}
      <div>result : {`${Boolean(result)}`}</div>
    </>
  );
}

export default App;
