import { Fragment, useEffect, useState } from 'react';
import './App.css';

interface MenuType {
  idx: number;
  parentIdx: number;
  name: string;
  child?: MenuType[];
}

function App() {
  const [maxMenuIdx, setMaxMenuIdx] = useState(0);
  const [menu, setMenu] = useState<MenuType[]>([
    {
      idx: 1,
      parentIdx: 0,
      name: '메뉴1',
      child: [
        {
          idx: 2,
          parentIdx: 1,
          name: '메뉴1의 자식 메뉴',
        },
      ],
    },
  ]);

  // 최대 인덱스 값 추출
  useEffect(() => {
    const calculateMaxIdx = (menu: MenuType[]) => {
      let maxMenuIdx = 0;
      const findMaxMenuIdx = (menu: MenuType[]) => {
        menu.map((item: MenuType) => {
          if (item.idx > maxMenuIdx) {
            maxMenuIdx = item.idx;
          }
          // child 속성이 있으면 재귀 start
          if (item.child) {
            findMaxMenuIdx(item.child);
          }
        });
      };
      findMaxMenuIdx(menu);
      return maxMenuIdx;
    };
    setMaxMenuIdx(calculateMaxIdx(menu));
  }, [menu]);

  // 추가 함수
  const addMenu = (newMenu: MenuType) => {
    // 추가 재귀 함수
    const addRecursively = (menus: MenuType[]): MenuType[] => {
      return menus.map((menusItem) => {
        // 맵 돌려서 만난 인덱스와 새로 추가하려는 부모의 인덱스가 같으면
        if (menusItem.idx === newMenu.parentIdx) {
          return {
            ...menusItem,
            child: menusItem.child ? [...menusItem.child, newMenu] : [newMenu], // child에 값을 추가한다
          };
        }

        // child가 있다면 재귀함수 실행
        if (menusItem.child) {
          return {
            ...menusItem,
            child: addRecursively(menusItem.child),
          };
        }
        return menusItem;
      });
    };

    // setMenu 업데이트
    setMenu(newMenu.parentIdx === 0 ? [...menu, newMenu] : addRecursively(menu));
  };

  return (
    <div>
      <div className="border rounded-lg m-4 py-2 px-4">
        {menu.map((menuItem) => {
          return (
            <Fragment key={menuItem.idx}>
              {/* 재귀 컴포넌트 */}
              <MenuRecursively node={menuItem} addMenu={addMenu} maxMenuIdx={maxMenuIdx} />
            </Fragment>
          );
        })}
        <button
          className="btn btn-xs"
          onClick={() => {
            addMenu({
              idx: maxMenuIdx + 1,
              name: `메뉴 ${maxMenuIdx + 1}`,
              parentIdx: 0,
            });
          }}
        >
          추가
        </button>
      </div>
    </div>
  );
}
// 재귀 컴포넌트
const MenuRecursively = ({
  node,
  addMenu,
  maxMenuIdx,
}: {
  node: MenuType;
  addMenu: (menuType: MenuType) => void;
  maxMenuIdx: number;
}) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  return (
    <div className="ml-4">
      <div className="flex">
        <div
          className="cursor-pointer"
          onClick={() => {
            // 인덱스를 찾아서 open 토글 시킨다.
            setOpenMenus((prev) => ({ ...prev, [node.idx]: !prev[node.idx] }));
          }}
        >
          {node.name}
        </div>
        <button
          className="btn btn-xs"
          onClick={() => {
            setOpenMenus((prev) => ({ ...prev, [node.idx]: true }));
            addMenu({
              idx: maxMenuIdx + 1,
              name: `메뉴 ${maxMenuIdx + 1}`,
              parentIdx: node.idx,
            });
          }}
        >
          추가
        </button>
      </div>

      {/* 자식의 자식 재귀 컴포넌트 */}
      {openMenus[node.idx] &&
        node.child &&
        node.child.map((childItem) => {
          return (
            <Fragment key={childItem.idx}>
              <MenuRecursively node={childItem} maxMenuIdx={maxMenuIdx} addMenu={addMenu} />
            </Fragment>
          );
        })}
    </div>
  );
};

export default App;
