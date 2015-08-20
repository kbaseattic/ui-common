
    e.g.,

    $('#table').kbaseTable(
        {
            structure : {
                header : [
                    'a',
                    'b',
                    'c',
                    'd'
                ],
                rows : [
                    {
                        'a' : 'a1',
                        'b' : 'b1',
                        'c' : 'c1',
                        'd' : 'd1'
                    },
                    {
                        'a' : 'a2',
                        'b' : 'b4',
                        'c' : 'c2',
                        'd' : 'd2'
                    },
                    {
                        'a' : 'a2',
                        'b' : { value : 'b4', colspan : 1},
                        'c' : { value : 'acc'},
                        'd' : 'd2'
                    },
                    {
                        'a' : 'a3',
                        'b' : 'b3',
                        'c' : 'c3',
                        'd' : 'd3',
                    },
                ],
                footer : [
                    'f1', 'f2', 'f3', 'f4'
                ]
            }
        }
    );