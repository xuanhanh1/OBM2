import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
function useLoading(dataChange) {
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(_.isEmpty(dataChange));
  }, [dataChange]);
  return [isLoading, setLoading];
}

export default useLoading;
