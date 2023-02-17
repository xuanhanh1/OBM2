import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Tabs } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import { createRoles, editRoles } from "../../../../../redux/actions/QuanTri";
import { getAllMenus } from "../../../../../redux/actions/Menu";
import TreeView from "devextreme-react/tree-view";
import { _, Input, Notification } from "../../../index";
const { TabPane } = Tabs;

function renderTreeViewItem(item) {
  return `${item.TEN_MENU}`;
}
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
  const [isResult, setResult] = useState(null);
  const lstAllMenu = useSelector((state) =>
    _.sortBy(state.MenuReducers.lstAllMenu, "THUTU")
  );
  const lstMenu = useSelector((state) =>
    _.sortBy(state.MenuReducers.lstMenu, "THUTU")
  );
  let isLstPickMenu = [];
  //Các danh sách select option
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getAllMenus());
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(lstAllMenu) && isStatus === 1) {
      let menuChild = _.filter(objEdit.MENUS, (x) => !_.isNull(x.MENU_CHAID));
      let arr = [];
      _.map(lstAllMenu, (item) => {
        arr.push(...item.CHILDREN);
      });
      _.map(menuChild, (item) => {
        let obj = _.find(arr, (x) => x.id === item.id);
        if (!_.isUndefined(obj)) {
          obj.selected = true;
        }
      });
    }
  }, [lstAllMenu]);

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!_.isNull(isResult)) {
      isResult.then((result) => {
        if (result) {
          setObjEdit({});
          setVisible(false);
        } else {
          Notification("error", "Cập nhật không thành công !");
        }
      });
    }
  }, [isResult]);
  //Submit form
  const onSubmit = (data) => {
    if (isStatus === 0) {
      //Thêm mới
      setResult(dispatch(createRoles({ ...data, LstMenus: isLstPickMenu })));
    } else {
      //Sửa
      setResult(dispatch(editRoles({ ...data, LstMenus: isLstPickMenu })));
    }
  };
  const onSelectionMenu = ({ component }) => {
    let arrParent = [];
    const treeView = component;
    const selectedItem = treeView.getSelectedNodes().map((node) => {
      let parent = _.isNull(node.parent) ? {} : node.parent.itemData;
      if (!_.isEmpty(parent)) {
        if (!_.some(arrParent, (item) => item.MENUID === parent.id)) {
          arrParent.push({ MENUID: parent.id });
        }
      }

      if (!_.isEmpty(parent)) {
        return { MENUID: node.itemData.id };
      }
      return {};
    });
    isLstPickMenu = [
      ..._.filter(selectedItem, (x) => !_.isEmpty(x)),
      ...arrParent,
    ];
  };
  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("ThemVaiTro") : t("SuaVaiTro")}
        visible={isVisible}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 20 }}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="form"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Vai trò" key="1">
            <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label={"TenVaiTro"}
                name={register("NAME", { required: true })}
                required
                errors={errors}
              />
              <Input
                label={"Mặc định"}
                name={register("ISDEFAULT")}
                type="checkbox"
              />
            </form>
          </TabPane>
          <TabPane tab="Quyền" key="2">
            <TreeView
              id="treeview"
              width="46vw"
              height="60vh"
              items={lstAllMenu}
              selectNodesRecursive={true}
              selectByClick={true}
              showCheckBoxesMode="selectAll"
              selectionMode={"multiple"}
              onSelectionChanged={onSelectionMenu}
              itemRender={renderTreeViewItem}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

export default ModalCreateAndEdit;
